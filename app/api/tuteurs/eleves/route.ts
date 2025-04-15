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

  // ✅ Requête directe sur la vue
  const { data, error } = await supabase
    .from('tuteurs_eleves_details')
    .select('*')
    .eq('tuteur_id', tuteur_id)

  if (error) {
    console.error('[API] Erreur tuteurs_eleves_details :', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.debug('[DEBUG] Élèves reçus via la vue :', data)

  return NextResponse.json(data)
}
