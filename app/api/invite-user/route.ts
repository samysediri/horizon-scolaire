import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, role, nom } = await req.json();

    if (!email || !role || !nom) {
      return NextResponse.json({ error: 'Email, nom et rôle requis.' }, { status: 400 });
    }

    // Étape 1: Envoyer l'invitation
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);

    if (inviteError || !inviteData?.user?.id) {
      return NextResponse.json({ error: inviteError?.message || 'Échec de l’invitation.' }, { status: 500 });
    }

    const userId = inviteData.user.id;

    // Étape 2: Insérer dans la table profiles
    const { error: profileError } = await supabase.from('profiles').insert({
      uuid: userId,
      email,
      role,
      nom,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Étape 3: Insérer dans la table spécifique selon le rôle
    if (role === 'tuteur' || role === 'eleve' || role === 'parent') {
      const table = role + 's'; // "tuteurs", "eleves", "parents"
      const { error: insertError } = await supabase.from(table).insert({
        uuid: userId,
        nom,
        email,
      });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur serveur: ' + err.message }, { status: 500 });
  }
}
