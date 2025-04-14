// Fichier : app/api/tuteurs/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tuteurs')
      .select('id, nom, email')

    if (error) {
      console.error('[API] Erreur récupération tuteurs:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[API] Tuteurs récupérés:', data)

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[API] Exception:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
