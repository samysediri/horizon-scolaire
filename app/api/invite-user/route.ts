import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Adresse courriel manquante' }, { status: 400 });
  }

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: 'https://horizon-scolaire.vercel.app/auth/confirm'
  });

  if (error) {
    console.error('Erreur en invitant:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
