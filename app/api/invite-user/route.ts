// app/api/invite-user/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, name } = body

  if (!email || !name) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  if (!serviceRoleKey || !supabaseUrl) {
    console.error('Clés d\'API manquantes:', { serviceRoleKey, supabaseUrl })
    return NextResponse.json({ error: 'Clés d\'API manquantes' }, { status: 500 })
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
        role: 'tutor',
      },
      redirect_to: redirectTo,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Erreur invitation API:', error)
    return NextResponse.json({ error: error.message || 'Erreur API' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
