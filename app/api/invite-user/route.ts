import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role, metadata } = body;

    if (!email || !role) {
      return new Response(JSON.stringify({ error: 'Email ou rôle manquant' }), { status: 400 });
    }

    console.log('[API] Envoi invitation à :', email);
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://horizon-scolaire.vercel.app/auth/confirm',
      data: {
        role,
        ...metadata
      }
    });

    if (error) {
      console.error('[API] Erreur Supabase:', error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log('[API] Invitation envoyée avec succès.');
    return new Response(JSON.stringify({ message: 'Invitation envoyée', data }), { status: 200 });
  } catch (err) {
    console.error('[API] Exception:', err.message);
    return new Response(JSON.stringify({ error: 'Erreur serveur : ' + err.message }), { status: 500 });
  }
}
