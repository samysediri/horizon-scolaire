// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    console.error("Erreur de récupération de l'utilisateur :", error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Récupère le rôle de l'utilisateur depuis la table "profiles"
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error("Erreur de récupération du profil :", profileError)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const redirectUrl = profile.role === 'admin'
    ? '/dashboard/admin'
    : '/dashboard'

  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
