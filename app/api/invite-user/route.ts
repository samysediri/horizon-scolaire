import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createServerActionClient({ cookies });
  const body = await req.json();

  const { email, role = 'tuteur', metadata = {}, nom } = body;

  if (!email) {
    return NextResponse.json({ error: 'Le courriel est requis.' }, { status: 400 });
  }

  const userMetadata = { ...metadata };
  if (nom && !userMetadata.nom) userMetadata.nom = nom;

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: userMetadata,
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Insérer dans `profiles`
  await supabase.from('profiles').insert([
    {
      uuid: data.user.id,
      email,
      nom: userMetadata.nom || '',
      role,
    },
  ]);

  // Insérer dans la table dédiée si c’est un tuteur
  if (role === 'tuteur') {
    await supabase.from('tuteurs').insert([
      {
        uuid: data.user.id,
        email,
        nom: userMetadata.nom || '',
      },
    ]);
  }

  return NextResponse.json({ message: 'Invitation envoyée' });
}
