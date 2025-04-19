import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, nom, role = 'tuteur' } = await req.json();

    if (!email || !nom) {
      return NextResponse.json({ error: 'Email et nom requis.' }, { status: 400 });
    }

    // 1. Créer l’utilisateur via Supabase
    const { data: user, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);

    if (inviteError || !user?.user?.id) {
      return NextResponse.json({ error: inviteError?.message || 'Erreur d’invitation.' }, { status: 500 });
    }

    const userId = user.user.id;

    // 2. Ajouter une entrée dans `profiles`
    const { error: profileError } = await supabase.from('profiles').insert({
      uuid: userId,
      email,
      nom,
      role,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 3. Ajouter dans la table spécifique au rôle (optionnel mais recommandé)
    if (role === 'tuteur') {
      await supabase.from('tuteurs').insert({ uuid: userId, nom, email });
    } else if (role === 'eleve') {
      await supabase.from('eleves').insert({ uuid: userId, nom, email });
    } else if (role === 'parent') {
      await supabase.from('parents').insert({ uuid: userId, nom, email });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API] Erreur /invite-user:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
