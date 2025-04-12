// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({
    cookies
  })

  // ⚠️ ici on passe l'URL et non l'objet request au complet
  const { error } = await supabase.auth.exchangeCodeForSession(request.url)

  if (error) {
    console.error("Erreur d'échange de session :", error.message)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si tout va bien, redirige vers le dashboard (le redirect intelligent sera fait là-bas)
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
