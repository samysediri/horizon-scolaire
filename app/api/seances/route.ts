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
      .select('id, debut, fin, duree_minutes, sujet, eleve_id')
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
