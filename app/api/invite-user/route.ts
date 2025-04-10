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

  const inviteRes = await supabase.auth.admin.createUser({
    email,
    email_confirm: false,
    user_metadata: {
      full_name: name,
      role: 'tutor'
    }
  })

  if (inviteRes.error) {
    console.error('Erreur invitation:', inviteRes.error)
    return NextResponse.json({ error: inviteRes.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
