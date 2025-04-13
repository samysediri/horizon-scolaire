// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body: any = null

  try {
    body = await req.json()
  } catch (e) {
    console.error('Erreur parsing JSON dans la requête entrante:', e)
    return NextResponse.json({ error: 'Requête invalide : JSON malformé' }, { status: 400 })
  }

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
  let responseText = await response.text()

  try {
    data = JSON.parse(responseText)
  } catch (jsonError) {
    console.error('Erreur parsing JSON Supabase:', jsonError)
    console.error('Réponse brute reçue :', responseText)
    return NextResponse.json({ error: 'Réponse invalide de Supabase' }, { status: 500 })
  }

  if (!response.ok) {
    console.error('Erreur API Supabase:', data)
    return NextResponse.json({ error: data?.message || 'Erreur API' }, { status: 500 })
  }

  return NextResponse.json({ user_id: data.user?.id })
}
