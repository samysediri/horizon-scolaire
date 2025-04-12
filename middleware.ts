// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Initialise Supabase avec les cookies de la requête
  const supabase = createMiddlewareClient({ req, res })

  // Important : hydrate les cookies pour rendre la session disponible
  await supabase.auth.getSession()

  return res
}

// Exécute ce middleware sur toutes les routes sauf les assets statiques
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
