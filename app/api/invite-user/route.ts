// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, name } = await req.json()

  if (!email || !name) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

 const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // ta vraie clé ici entre guillemets


  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  if (!serviceRoleKey || !supabaseUrl) {
    console.error("Clé ou URL Supabase manquante.")
    return NextResponse.json({ error: 'Clé ou URL manquante' }, { status: 500 })
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
