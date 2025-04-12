// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  // Crée une instance Supabase avec les cookies du serveur
  const supabase = await createServerClient()

  // Récupère l'utilisateur connecté
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Erreur récupération user:', userError)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Vérifie le rôle de l'utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    console.error('Permission refusée ou erreur profile:', profileError)
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 })
  }

  // Récupère les champs envoyés par le formulaire
  const body = await req.json()
  const { email, name } = body

  if (!email || !name) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  // Récupère les variables d'environnement
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  if (!serviceRoleKey || !supabaseUrl || !redirectTo) {
    console.error('Clés d\'API manquantes', {
      serviceRoleKey,
      supabaseUrl,
      redirectTo,
    })
    return NextResponse.json({ error: 'Clés d\'API manquantes' }, { status: 500 })
  }

  // Envoie la requête d’invitation à Supabase
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

  // Gère les erreurs de l’API Supabase
  if (!response.ok) {
    const error = await response.json()
    console.error('Erreur invitation API:', error)
    return NextResponse.json({ error: error.message || 'Erreur API' }, { status: 500 })
  }

  // Succès!
  return NextResponse.json({ success: true })
}
