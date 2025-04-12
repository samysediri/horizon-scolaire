// app/api/eleves/route.ts
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createServerActionClient({ cookies })

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nom, email")
    .eq("role", "eleve")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
