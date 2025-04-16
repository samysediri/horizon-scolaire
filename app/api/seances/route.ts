// Fichier : app/api/seances/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 🔍 GET : Récupérer les séances du tuteur
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tuteur_id = searchParams.get('tuteur_id')

  if (!tuteur_id) {
    return NextResponse.json({ error: 'Paramètre tuteur_id manquant' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('seances')
      .select('id, debut, fin, duree_minutes, sujet, eleve_id')
      .eq('tuteur_id', tuteur_id)

    if (error) {
      console.error('[API GET /seances] Erreur Supabase :', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[API GET /seances] Exception :', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

// ➕ POST : Ajouter une séance
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tuteur_id, eleve_id, date, heure, duree, lien_lessonspace, eleve_nom } = body

    if (!tuteur_id || !eleve_id || !date || !heure || !duree || !lien_lessonspace || !eleve_nom) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const debut = new Date(`${date}T${heure}`)
    const fin = new Date(debut.getTime() + parseInt(duree) * 60000)

    const { data, error } = await supabase.from('seances').insert([
      {
        tuteur_id,
        eleve_id,
        debut,
        fin,
        duree_minutes: parseInt(duree),
        lien: lien_lessonspace,
        eleve_nom
      }
    ])

    if (error) {
      console.error('[API POST /seances] Erreur Supabase :', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Séance ajoutée!', data }, { status: 200 })
  } catch (err: any) {
    console.error('[API POST /seances] Exception :', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
