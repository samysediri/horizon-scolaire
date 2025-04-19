import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, role, metadata } = await req.json();
  const { prenom, nom } = metadata || {};

  if (!email || !role) {
    return NextResponse.json({ error: 'Email et rôle requis.' }, { status: 400 });
  }

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    console.error('[Invite] Erreur en invitant:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userId = data?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Impossible de récupérer le user ID.' }, { status: 500 });
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    email,
    role,
    prenom,
    nom,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
