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

  console.log('USER ID:', user.id)
  console.log('RÔLE TROUVÉ:', data?.role)
  console.log('ERREUR SUPABASE:', error)

  if (error || !data?.role) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  switch (data.role) {
    case 'admin':
      return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    case 'tutor':
      return NextResponse.redirect(new URL('/dashboard/tuteur', request.url))
    case 'parent':
      return NextResponse.redirect(new URL('/dashboard/parent', request.url))
    case 'student':
      return NextResponse.redirect(new URL('/dashboard/eleve', request.url))
    default:
      return NextResponse.redirect(new URL('/login', request.url))
  }
}
