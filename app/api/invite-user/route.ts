import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { email, nom, role } = body;

  if (!email || !nom || !role) {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 });
  }

  try {
    // Créer l'utilisateur sans mot de passe (il recevra un lien magique)
    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { nom },
    });

    if (signUpError) throw signUpError;

    // Ajouter dans la table "profiles"
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        uuid: user.user?.id,
        email,
        nom,
        role,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[INVITE USER ERROR]', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
