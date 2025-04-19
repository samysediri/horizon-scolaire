import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, nom, role = 'tuteur' } = body;

  const supabase = createClient();

  // Authentifier l'utilisateur actuel
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Seuls les admins peuvent inviter
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('uuid', user?.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 });
  }

  // Créer l'utilisateur via Supabase Auth
  const { data, error } = await supabase.auth.admin.inviteUser({
    email,
    options: {
      data: { nom, password_created: false },
    },
  });

  if (error) {
    console.error('Erreur invitation :', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Insérer dans la table profiles
  const insertProfile = await supabase.from('profiles').insert({
    uuid: data.user?.id,
    nom,
    email,
    role,
  });

  if (insertProfile.error) {
    console.error('Erreur insert profile :', insertProfile.error);
    return NextResponse.json({ error: 'Erreur insert profile' }, { status: 500 });
  }

  // Si tuteur, insérer dans tuteurs
  if (role === 'tuteur') {
    const insertTuteur = await supabase.from('tuteurs').insert({
      uuid: data.user?.id,
      nom,
      email,
    });

    if (insertTuteur.error) {
      console.error('Erreur insert tuteur :', insertTuteur.error);
      return NextResponse.json({ error: 'Erreur insert tuteur' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
