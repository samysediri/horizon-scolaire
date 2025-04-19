import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, role = 'tuteur', metadata = {}, nom } = body;

  if (!email) {
    return NextResponse.json({ error: 'Le courriel est requis.' }, { status: 400 });
  }

  const userMetadata = { ...metadata };
  if (nom && !userMetadata.nom) userMetadata.nom = nom;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // 👈 clé privée
  );

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: userMetadata,
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from('profiles').insert([
    {
      uuid: data.user.id,
      email,
      nom: userMetadata.nom || '',
      role,
    },
  ]);

  if (role === 'tuteur') {
    await supabaseAdmin.from('tuteurs').insert([
      {
        uuid: data.user.id,
        email,
        nom: userMetadata.nom || '',
      },
    ]);
  }

  return NextResponse.json({ message: 'Invitation envoyée' });
}
