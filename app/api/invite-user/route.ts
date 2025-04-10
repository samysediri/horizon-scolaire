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

  // Création manuelle d'un utilisateur avec un mot de passe temporaire
  const tempPassword = Math.random().toString(36).slice(-10) + 'A1!' // Assure-toi que ça respecte les règles de complexité
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    user_metadata: {
      full_name: name,
      role: 'tutor',
    },
  })

  if (createError) {
    console.error('Erreur création utilisateur:', createError)
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  // Optionnel : tu peux maintenant envoyer un courriel à `email` avec un lien pour réinitialiser son mot de passe

  return NextResponse.json({ success: true, user: newUser })
}
