import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (error) {
    console.warn("Erreur de session Supabase:", error)
    return res
  }

  // Si l'utilisateur est déjà connecté ET essaie d'aller sur /login
  if (session && req.nextUrl.pathname === '/login') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', req.url))
    }

    if (profile?.role === 'tuteur') {
      return NextResponse.redirect(new URL('/dashboard/tuteur', req.url))
    }

    if (profile?.role === 'eleve') {
      return NextResponse.redirect(new URL('/dashboard/eleve', req.url))
    }

    if (profile?.role === 'parent') {
      return NextResponse.redirect(new URL('/dashboard/parent', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
