// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient<Database>({ req, res })

  // ⚠️ Important : hydrate la session (nécessaire pour que getUser fonctionne ensuite)
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (error) {
    console.warn("Erreur lors de la récupération de session Supabase:", error)
  }

  return res
}

// Appliquer le middleware à toutes les routes sauf les assets statiques
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
