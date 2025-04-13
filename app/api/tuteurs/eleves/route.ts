// Fichier : app/api/tuteurs/eleves/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tuteurId = url.searchParams.get('tuteur_id');

    if (!tuteurId) {
      return NextResponse.json({ error: 'Paramètre "tuteur_id" manquant' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('eleves')
      .select('id, prenom, nom, email')
      .eq('tuteur_id', tuteurId);

    if (error) {
      console.error('[API] Erreur récupération élèves:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[API] Exception:', err.message);
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 });
  }
}
