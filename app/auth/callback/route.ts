// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { error } = await supabase.auth.exchangeCodeForSession(request)

  if (error) {
    console.error("Erreur d'échange de session:", error.message)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
