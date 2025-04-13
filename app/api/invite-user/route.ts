// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, nom, role } = body

  if (!email || !nom || !role) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Clés d’API manquantes' }, { status: 500 })
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
        full_name: nom,
        role: role,
      }
    }),
  })

  const userData = await response.json()

  if (!response.ok) {
    console.error('Erreur invitation API:', userData)
    return NextResponse.json({ error: userData.message || 'Erreur API' }, { status: 500 })
  }

  return NextResponse.json({ success: true, user_id: userData.user?.id || null })
}
