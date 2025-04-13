import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tuteur_id, eleve_id } = body

    if (!tuteur_id || !eleve_id) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const { error } = await supabase
      .from('tuteur_eleve')
      .insert([{ tuteur_id, eleve_id }])

    if (error) {
      console.error('[API] Erreur insertion lien tuteur/élève:', error.message)
      return NextResponse.json({ error: 'Erreur lors du lien tuteur/élève' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Lien tuteur-élève créé avec succès' })
  } catch (err: any) {
    console.error('[API] Exception tuteur/élève:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
