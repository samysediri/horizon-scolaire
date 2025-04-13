// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, name, role } = body

  console.log("=== DEBUG INVITE USER ===")
  console.log("SERVICE ROLE:", process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("EMAIL:", email)
  console.log("NAME:", name)
  console.log("ROLE:", role)

  if (!email || !name || !role) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    console.error('Clé API manquante')
    return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 })
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/admin/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
    body: JSON.stringify({
      email,
      data: {
        full_name: name,
        role,
      },
    }),
  })

  let data = null
  try {
    const text = await response.text()
    data = text ? JSON.parse(text) : null
  } catch (jsonError) {
    console.error('Erreur parsing JSON Supabase:', jsonError)
    return NextResponse.json({ error: 'Réponse non valide de Supabase (JSON)' }, { status: 500 })
  }

  if (!response.ok) {
    console.error('Erreur API Supabase:', data)
    return NextResponse.json({ error: data?.message || 'Erreur API Supabase' }, { status: 500 })
  }

  return NextResponse.json({ user_id: data?.user?.id || null })
}
