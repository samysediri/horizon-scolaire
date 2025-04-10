// app/api/invite-user/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  // Création du client Supabase avec la clé service_role
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const body = await req.json()
  const { email, name } = body

  if (!email || !name) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  // Création de l'utilisateur via l'API admin
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: false,
    user_metadata: {
      full_name: name,
      role: 'tutor'
    }
  })

  if (error) {
    console.error('Erreur invitation:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
