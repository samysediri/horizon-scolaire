// Fichier : app/api/invite-user/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, role, metadata } = body

    if (!email || !role) {
      return NextResponse.json({ error: 'Email ou rôle manquant' }, { status: 400 })
    }

    console.log('[API] Invitation à :', email)

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://horizon-scolaire.vercel.app/auth/confirm',
      data: {
        role,
        ...(metadata || {}),
      },
    })

    if (error || !data.user?.id) {
      console.error('[API] Erreur invitation:', error?.message)
      return NextResponse.json({ error: error?.message || 'Erreur API' }, { status: 500 })
    }

    const userId = data.user.id

    // ➕ Insertion dans "profiles"
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: userId,
      email,
      nom: metadata?.nom || '',
      prenom: metadata?.prenom || '',
      role,
    }])

    if (profileError) {
      console.error('[API] Erreur insertion profile:', profileError)
      return NextResponse.json({ error: 'Erreur lors de la création du profil' }, { status: 500 })
    }

    // ➕ Insertion dans "tuteurs", "eleves" ou "parents"
    if (role === 'tuteur') {
      const { error: tuteurError } = await supabase.from('tuteurs').insert([{ id: userId }])
      if (tuteurError) {
        console.error('[API] Erreur insertion tuteur:', tuteurError)
        return NextResponse.json({ error: 'Erreur lors de la création du tuteur' }, { status: 500 })
      }
    } else if (role === 'eleve') {
      const { error: eleveError } = await supabase.from('eleves').insert([{ id: userId }])
      if (eleveError) {
        console.error('[API] Erreur insertion élève:', eleveError)
        return NextResponse.json({ error: 'Erreur lors de la création de l’élève' }, { status: 500 })
      }
    } else if (role === 'parent') {
      const { error: parentError } = await supabase.from('parents').insert([{ id: userId }])
      if (parentError) {
        console.error('[API] Erreur insertion parent:', parentError)
        return NextResponse.json({ error: 'Erreur lors de la création du parent' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Invitation envoyée avec succès', user_id: userId })

  } catch (err: any) {
    console.error('[API] Exception:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
