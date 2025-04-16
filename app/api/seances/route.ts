// Fichier : app/api/seances/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Formate une Date JS vers le format "YYYY-MM-DD HH:MM:SS" en heure locale
function formatLocalDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tuteur_id, eleve_id, date, heure, duree, lien_lessonspace, eleve_nom } = body

    if (!tuteur_id || !eleve_id || !date || !heure || !duree || !lien_lessonspace) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = heure.split(':').map(Number)
    const debut = new Date(year, month - 1, day, hours, minutes)
    const fin = new Date(debut.getTime() + Number(duree) * 60000)

    const { error } = await supabase.from('seances').insert({
      tuteur_id,
      eleve_id,
      debut: formatLocalDateTime(debut),  // 👈 format local explicite
      fin: formatLocalDateTime(fin),
      duree_minutes: Number(duree),
      lien: lien_lessonspace,
      eleve_nom
    })

    if (error) {
      console.error('[API] Erreur insertion séance:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    const { error } = await supabase.from('seances').delete().eq('id', id)

    if (error) {
      console.error('[API] Erreur suppression séance:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tuteur_id = searchParams.get('tuteur_id')

  if (!tuteur_id) {
    return NextResponse.json({ error: 'Paramètre tuteur_id manquant' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('seances')
    .select('*')
    .eq('tuteur_id', tuteur_id)

  if (error) {
    console.error('[API] Erreur récupération séances:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
