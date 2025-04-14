// Fichier : app/api/tuteurs/eleves/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(req.url)
  const tuteur_id = searchParams.get('tuteur_id')

  if (!tuteur_id) {
    return NextResponse.json({ error: 'tuteur_id manquant' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tuteurs_eleves')
    .select(`eleve_id(id, prenom, nom, email, lien_lessonspace)`) // 👈 relation explicite
    .eq('tuteur_id', tuteur_id)

  if (error) {
    console.error('[API] Erreur tuteurs_eleves :', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const eleves = (data || [])
    .map((entry: any) => entry.eleve_id) // 👈 même nom ici
    .filter((e: any) => e !== null)

  console.debug('[DEBUG] Élèves reçus :', eleves)

  return NextResponse.json(eleves)
}
