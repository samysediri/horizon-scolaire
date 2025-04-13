// app/api/lier-eleve-parent/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const { eleve_id, parent_id } = await req.json()

  if (!eleve_id || !parent_id) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const { error } = await supabase.from('eleves_parents').insert([
    {
      eleve_id,
      parent_id,
    },
  ])

  if (error) {
    console.error('Erreur insertion relation élève-parent:', error)
    return NextResponse.json({ error: 'Erreur lors de la liaison' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
