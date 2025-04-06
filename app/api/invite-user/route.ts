// app/api/invite-user/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { email, nom, role } = await req.json()

  if (!email || !role) {
    return NextResponse.json({ error: 'Courriel et rôle requis.' }, { status: 400 })
  }

  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { role, nom },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/inscription`
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Invitation envoyée avec succès', data })
  } catch (e) {
    console.error('Erreur lors de l’envoi de l’invitation:', e)
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 })
  }
}
