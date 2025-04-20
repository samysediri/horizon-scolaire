// app/api/lier-eleve-parent/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { eleveId, parentId } = body

  if (!eleveId || !parentId) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const { error } = await supabase.from('eleves_parents').insert([
    { eleve_id: eleveId, parent_id: parentId }
  ])

  if (error) {
    console.error('[API] Erreur liaison élève-parent:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
