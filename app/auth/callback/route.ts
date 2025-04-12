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
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !data?.role) {
    console.error('Erreur récupération rôle:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let redirectUrl = '/dashboard'
  if (data.role === 'admin') redirectUrl = '/dashboard/admin'
  else if (data.role === 'tutor') redirectUrl = '/dashboard/tuteur'
  else if (data.role === 'parent') redirectUrl = '/dashboard/parent'
  else if (data.role === 'student') redirectUrl = '/dashboard/eleve'

  return NextResponse.redirect(new URL(redirectUrl, request.url))
}
