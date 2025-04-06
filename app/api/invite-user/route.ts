// app/api/invite-user/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { email, nom, role } = await req.json()

  if (!email || !role) {
    return NextResponse.json(
      { error: 'Le courriel et le rôle sont requis.' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient() // ✅ await ici !

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { role, nom },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/inscription`
    })

    if (error) {
      console.error('Erreur Supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (e: any) {
    console.error('Erreur serveur:', e.message)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l’envoi de l’invitation.' },
      { status: 500 }
    )
  }
}
