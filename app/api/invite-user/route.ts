// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, name, role } = body

  if (!email || !name || !role) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  console.log("Clé service:", process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (!serviceRoleKey || !supabaseUrl) {
    console.error('Clé API manquante')
    return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 })
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/admin/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      email,
      data: {
        full_name: name,
        role,
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Erreur API Supabase:', data)
    return NextResponse.json({ error: data.message || 'Erreur API' }, { status: 500 })
  }

  return NextResponse.json({ user_id: data.user?.id })
}
