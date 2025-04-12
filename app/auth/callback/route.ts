// app/auth/callback/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    console.error('Erreur de récupération utilisateur:', error)
    return NextResponse.redirect(new URL('/login?erreur=auth', request.url))
  }

  // Récupérer le profil dans la table "profiles"
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Erreur de récupération du profil:', profileError)
    return NextResponse.redirect(new URL('/login?erreur=profil', request.url))
  }

  let redirectUrl = '/dashboard'

  if (profile.role === 'admin') {
    redirectUrl = '/dashboard/admin'
  } else if (profile.role === 'tuteur') {
    redirectUrl = '/dashboard/tuteur'
  } else if (profile.role === 'parent') {
    redirectUrl = '/dashboard/parent'
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
