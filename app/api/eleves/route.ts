// Fichier : app/api/eleves/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nom, prenom, email, lien_lessonspace')
      .eq('role', 'eleve');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[API] Erreur dans /api/eleves :', err.message);
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 });
  }
}
