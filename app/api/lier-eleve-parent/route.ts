// app/api/lier-eleve-parent/route.ts
import { NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { eleve_id, parent_id } = await req.json()

  if (!eleve_id || !parent_id) {
    return NextResponse.json({ error: 'Élève ou parent manquant' }, { status: 400 })
  }

  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.from('eleves_parents').insert([
    { eleve_id, parent_id },
  ])

  if (error) {
    console.error('Erreur INSERT eleves_parents:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
