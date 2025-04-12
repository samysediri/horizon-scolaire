// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Erreur récupération utilisateur:', userError)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Erreur récupération profil:', profileError)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)
  }

  if (profile.role === 'admin') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/admin`)
  }

  if (profile.role === 'tutor') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/tuteur`)
  }

  if (profile.role === 'student') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/eleve`)
  }

  // Par défaut, on redirige vers le tableau de bord de base
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`)
}
