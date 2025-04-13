// app/api/invite-user/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, role, metadata, parentEmail, parentName } = body

    if (!email || !role || !parentEmail || !parentName) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Invitation de l'élève
    const { data: eleveData, error: eleveError } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://horizon-scolaire.vercel.app/auth/confirm',
      data: {
        role,
        ...(metadata || {}),
      },
    })

    if (eleveError || !eleveData.user?.id) {
      console.error('[API] Erreur invitation élève:', eleveError?.message)
      return NextResponse.json({ error: eleveError?.message || 'Erreur API (élève)' }, { status: 500 })
    }

    const eleveId = eleveData.user.id

    // ➕ Insertion élève dans profiles
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: eleveId,
      email,
      nom: metadata?.nom || '',
      role,
    }])

    if (profileError) {
      console.error('[API] Erreur insertion profil élève:', profileError)
      return NextResponse.json({ error: 'Erreur création profil élève' }, { status: 500 })
    }

    // ➕ Si élève, insérer aussi dans "eleves"
    if (role === 'eleve') {
      const { error: eleveTableError } = await supabase.from('eleves').insert([{ id: eleveId }])
      if (eleveTableError) {
        console.error('[API] Erreur insertion table eleves:', eleveTableError)
        return NextResponse.json({ error: 'Erreur création entrée élève' }, { status: 500 })
      }
    }

    // Invitation du parent
    const { data: parentData, error: parentError } = await supabase.auth.admin.inviteUserByEmail(parentEmail, {
      redirectTo: 'https://horizon-scolaire.vercel.app/auth/confirm',
      data: {
        role: 'parent',
        nom: parentName,
      },
    })

    if (parentError || !parentData.user?.id) {
      console.error('[API] Erreur invitation parent:', parentError?.message)
      return NextResponse.json({ error: parentError?.message || 'Erreur API (parent)' }, { status: 500 })
    }

    const parentId = parentData.user.id

    // ➕ Insertion parent dans profiles
    const { error: parentProfileError } = await supabase.from('profiles').insert([{
      id: parentId,
      email: parentEmail,
      nom: parentName,
      role: 'parent',
    }])

    if (parentProfileError) {
      console.error('[API] Erreur insertion profil parent:', parentProfileError)
      return NextResponse.json({ error: 'Erreur création profil parent' }, { status: 500 })
    }

    // ➕ Insérer dans la table de liaison
    const { error: lienError } = await supabase.from('eleves_parents').insert([{
      eleve_id: eleveId,
      parent_id: parentId,
    }])

    if (lienError) {
      console.error('[API] Erreur création lien élève-parent:', lienError)
      return NextResponse.json({ error: 'Erreur création lien élève-parent' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Invitations envoyées', user_id: eleveId })

  } catch (err: any) {
    console.error('[API] Exception générale:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
