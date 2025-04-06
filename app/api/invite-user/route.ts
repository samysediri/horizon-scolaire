// app/api/invite-user/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, nom, role } = body

  if (!email || !role) {
    return NextResponse.json({ error: 'Email ou rôle manquant.' }, { status: 400 })
  }

  // ✅ Client admin Supabase avec la clé service_role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ATTENTION : jamais utiliser ça côté client
  )

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { role, nom },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/inscription`
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Invitation envoyée !', data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
