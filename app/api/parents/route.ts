// app/api/parents/route.ts
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerActionClient({ cookies })

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, nom')
      .eq('role', 'parent')

    if (error) {
      console.error('Erreur Supabase :', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Erreur interne dans /api/parents:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
