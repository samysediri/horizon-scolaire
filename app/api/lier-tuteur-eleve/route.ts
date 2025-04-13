// app/api/lier-tuteur-eleve/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eleve_id, tuteur_id } = body

    if (!eleve_id || !tuteur_id) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const { error } = await supabase.from('tuteurs_eleves').insert({ eleve_id, tuteur_id })

    if (error) {
      console.error('[API] Erreur liaison tuteur-élève:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Tuteur lié à l’élève avec succès!' })
  } catch (err: any) {
    console.error('[API] Exception:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
