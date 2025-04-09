import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createServerActionClient({ cookies })
  const { tuteur_id, eleve_id } = await request.json()

  if (!tuteur_id || !eleve_id) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 })
  }

  const { error } = await supabase.from("tuteurs_eleves").insert({
    tuteur_id,
    eleve_id,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
