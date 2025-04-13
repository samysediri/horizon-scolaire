// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const { email, nom, role } = await req.json()

  if (!email || !nom || !role) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  if (!serviceRoleKey || !supabaseUrl || !redirectTo) {
    return NextResponse.json({ error: 'Configuration incomplète' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  // 1. Créer l'utilisateur
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      nom,
      role,
    },
    redirect_to: redirectTo,
  })

  if (userError || !userData?.user?.id) {
    console.error('Erreur lors de la création de l’utilisateur Supabase:', userError)
    return NextResponse.json({ error: userError?.message || 'Erreur création utilisateur' }, { status: 500 })
  }

  const user_id = userData.user.id

  // 2. Ajouter le profil dans la table "profiles"
  const { error: insertError } = await supabase.from('profiles').insert([
    {
      id: user_id,
      email,
      nom,
      role,
    },
  ])

  if (insertError) {
    console.error('Erreur lors de l’insertion dans profiles:', insertError)
    return NextResponse.json({ error: 'Utilisateur créé mais erreur lors de l’insertion du profil' }, { status: 500 })
  }

  return NextResponse.json({ success: true, user_id })
}
