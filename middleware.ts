// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient<Database>({ req, res })

  // Hydrate les cookies pour que Supabase puisse valider la session
  await supabase.auth.getSession()

  return res
}

// Appliquer le middleware à toutes les routes sauf les fichiers statiques et l'API
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
