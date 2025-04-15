import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies // ✅ ne pas appeler cookies() — passer la fonction elle-même
    }
  )

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
  }

  const tuteur_id = profile.id

  const { data, error } = await supabase
    .from('tuteurs_eleves')
    .select('eleves(id, prenom, nom, email)')
    .eq('tuteur_id', tuteur_id)

  if (error) {
    console.error('[API] Erreur récupération élèves:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const eleves = data.map((entry) => entry.eleves)

  return NextResponse.json(eleves)
}
