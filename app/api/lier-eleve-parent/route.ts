import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createServerActionClient({ cookies })
  const { eleve_id, parent_id } = await request.json()

  if (!eleve_id || !parent_id) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 })
  }

  const { error } = await supabase.from("eleves_parents").insert({
    eleve_id,
    parent_id,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
