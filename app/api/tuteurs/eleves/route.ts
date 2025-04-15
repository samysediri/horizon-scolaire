// Fichier : app/api/eleves/route.ts
import { NextResponse } from 'next/server'
import { createServerClient, cookieStore } from '@supabase/ssr'

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: () => cookieStore()
    }
  )

  // Obtenir l'utilisateur connecté
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 })
  }

  // Obtenir le profil lié (doit être dans la table "profiles")
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
  }

  const tuteur_id = profile.id

  // Requête pour récupérer les élèves associés à ce tuteur
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
