import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, role, metadata } = body;

  if (!email || !role || !metadata?.prenom || !metadata?.nom) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
  }

  // Étape 1 : créer l'utilisateur avec Supabase Auth
  const { data: user, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      prenom: metadata.prenom,
      nom: metadata.nom,
      role,
    },
  });

  if (inviteError) {
    console.error('[Invite Error]', inviteError.message);
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  const user_id = user?.user?.id;
  if (!user_id) {
    return NextResponse.json({ error: "Impossible d'obtenir l'ID de l'utilisateur." }, { status: 500 });
  }

  // Étape 2 : insérer dans la table `profiles`
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user_id,
    email,
    role,
    prenom: metadata.prenom,
    nom: metadata.nom,
  });

  if (profileError) {
    console.error('[Profile Error]', profileError.message);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Étape 3 : insérer aussi dans la table correspondante (tuteurs, eleves ou parents)
  const tableName = role === 'tuteur' ? 'tuteurs' : role === 'eleve' ? 'eleves' : 'parents';

  const { error: roleInsertError } = await supabase.from(tableName).insert({
    id: user_id,
    prenom: metadata.prenom,
    nom: metadata.nom,
  });

  if (roleInsertError) {
    console.error(`[${role} Error]`, roleInsertError.message);
    return NextResponse.json({ error: roleInsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
