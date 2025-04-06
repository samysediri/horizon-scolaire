import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { email, nom, role } = await req.json()

  if (!email || !role || !nom) {
    return NextResponse.json({ error: 'Informations manquantes.' }, { status: 400 })
  }

  const supabase = createClient() // ce n’est **pas** async avec la bonne version du fichier server.ts

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { role, nom },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/inscription`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Invitation envoyée.', data })
  } catch (err) {
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 })
  }
}
