// app/api/tuteurs/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nom, email')
      .eq('role', 'tuteur')

    if (error) {
      console.error('[API] Erreur récupération tuteurs:', error.message)
      return NextResponse.json({ error: 'Erreur lors de la récupération des tuteurs' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[API] Exception tuteurs:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
