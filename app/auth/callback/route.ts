// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: Request) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Erreur récupération utilisateur:', userError)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)
  }

  // Redirige selon le rôle
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.role) {
    console.error('Erreur récupération rôle:', profileError)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`)
  }

  const role = profile.role
  const redirectPath =
    role === 'admin'
      ? '/dashboard/admin'
      : role === 'tutor'
      ? '/dashboard/tuteur'
      : role === 'parent'
      ? '/dashboard/parent'
      : role === 'student'
      ? '/dashboard/eleve'
      : '/dashboard'

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}${redirectPath}`)
}
