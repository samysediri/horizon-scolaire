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

    if (!email || !role) {
      return NextResponse.json({ error: 'Email ou rôle manquant' }, { status: 400 })
    }

    // 1. 🔵 Inviter l'utilisateur principal
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://horizon-scolaire.vercel.app/auth/confirm',
      data: {
        role,
        ...(metadata || {}),
      },
    })

    if (error || !data.user?.id) {
      console.error('[API] Erreur invitation principale:', error?.message)
      return NextResponse.json({ error: error?.message || 'Erreur API principale' }, { status: 500 })
    }

    const userId = data.user.id

    // ➕ Ajouter à "profiles"
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: userId,
      email,
      nom: metadata?.nom || '',
      role,
    }])

    if (profileError) {
      console.error('[API] Erreur insertion profil:', profileError)
      return NextResponse.json({ error: 'Erreur création profil utilisateur' }, { status: 500 })
    }

    // ➕ Si tuteur, ajouter à "tuteurs"
    if (role === 'tuteur') {
      const { error: tuteurError } = await supabase.from('tuteurs').insert([{ id: userId }])
      if (tuteurError) {
        console.error('[API] Erreur insertion tuteur:', tuteurError)
        return NextResponse.json({ error: 'Erreur création tuteur' }, { status: 500 })
      }
    }

    // 2. 🟣 Si des infos de parent sont fournies (cas élève), on invite aussi le parent
    let parentId = null

    if (parentEmail && parentName) {
      const { data: parentData, error: parentError } = await supabase.auth.admin.inviteUserByEmail(parentEmail, {
        redirectTo: 'https://horizon-scolaire.vercel.app/auth/confirm',
        data: {
          role: 'parent',
          nom: parentName,
        },
      })

      if (parentError || !parentData.user?.id) {
        console.error('[API] Erreur invitation parent:', parentError?.message)
        return NextResponse.json({ error: parentError?.message || 'Erreur API parent' }, { status: 500 })
      }

      parentId = parentData.user.id

      const { error: parentProfileError } = await supabase.from('profiles').insert([{
        id: parentId,
        email: parentEmail,
        nom: parentName,
        role: 'parent',
      }])

      if (parentProfileError) {
        console.error('[API] Erreur profil parent:', parentProfileError)
        return NextResponse.json({ error: 'Erreur création profil parent' }, { status: 500 })
      }

      // Lier élève <-> parent
      const { error: lienError } = await supabase.from('eleves_parents').insert([{
        eleve_id: userId,
        parent_id: parentId,
      }])

      if (lienError) {
        console.error('[API] Erreur lien élève-parent:', lienError)
        return NextResponse.json({ error: 'Erreur liaison élève-parent' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Invitation envoyée avec succès', user_id: userId, parent_id: parentId })

  } catch (err: any) {
    console.error('[API] Exception:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

