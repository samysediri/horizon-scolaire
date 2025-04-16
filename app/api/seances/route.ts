// Fichier : app/api/seances/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tuteur_id = searchParams.get('tuteur_id')

  if (!tuteur_id) {
    return NextResponse.json({ error: 'Paramètre tuteur_id manquant' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('seances')
      .select('id, debut, fin, duree_minutes, sujet, eleve_id, lien')
      .eq('tuteur_id', tuteur_id)

    if (error) {
      console.error('[API] Erreur récupération séances:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[API] Exception:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { tuteur_id, eleve_id, date, heure, duree, lien_lessonspace, eleve_nom } = body

  if (!tuteur_id || !eleve_id || !date || !heure || !duree || !lien_lessonspace) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  try {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000
    const debut = new Date(new Date(`${date}T${heure}:00`).getTime() + timezoneOffset)
    const fin = new Date(debut.getTime() + parseInt(duree) * 60000)

    const { error } = await supabase.from('seances').insert({
      tuteur_id,
      eleve_id,
      debut,
      fin,
      duree_minutes: parseInt(duree),
      sujet: `Séance avec ${eleve_nom || 'élève'}`,
      lien: lien_lessonspace
    })

    if (error) {
      console.error('Erreur insertion séance:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Séance ajoutée' })
  } catch (err: any) {
    console.error('[API] Exception POST:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'ID manquant pour suppression' }, { status: 400 })
  }

  const { error } = await supabase
    .from('seances')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur lors de la suppression :', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Séance supprimée' })
}
