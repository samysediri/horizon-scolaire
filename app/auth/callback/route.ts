// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

  const { error } = await supabase.auth.exchangeCodeForSession(request.url)

  if (error) {
    console.error("Erreur d'échange de session :", error.message)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
