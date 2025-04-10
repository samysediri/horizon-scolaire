// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error('Erreur récupération user:', userError)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    console.error('Permission refusée ou erreur profile:', profileError)
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 })
  }

  const body = await req.json()
  const { email, name } = body

  if (!email || !name) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  if (!serviceRoleKey || !supabaseUrl) {
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
