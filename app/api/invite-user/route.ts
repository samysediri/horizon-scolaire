// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
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

  // Appel à l’API REST Admin avec la clé service_role dans l’en-tête
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      user_metadata: {
        full_name: name,
        role: 'tutor',
      },
    }),
  })

  if (!res.ok) {
    const errorBody = await res.json()
    console.error('Erreur invitation:', errorBody)
    return NextResponse.json({ error: errorBody.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
