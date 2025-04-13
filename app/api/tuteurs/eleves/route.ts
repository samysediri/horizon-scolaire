// Fichier : app/api/tuteurs/eleves/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tuteurId = searchParams.get('tuteur_id');

  if (!tuteurId) {
    return NextResponse.json({ error: 'Paramètre "tuteur_id" manquant' }, { status: 400 });
  }

  try {
    // Chercher les élèves liés au tuteur via la table tuteurs_eleves
    const { data: relations, error: relError } = await supabase
      .from('tuteurs_eleves')
      .select('eleve_id')
      .eq('tuteur_id', tuteurId);

    if (relError) throw relError;

    const eleveIds = relations.map((r) => r.eleve_id);

    if (eleveIds.length === 0) return NextResponse.json([]);

    // Récupérer les infos des élèves dans la table profiles
    const { data: eleves, error: eleveError } = await supabase
      .from('profiles')
      .select('id, nom, prenom, email, lien_lessonspace')
      .in('id', eleveIds);

    if (eleveError) throw eleveError;

    console.log('[API] Éleves retournés :', eleves); // 🔍 Log ajouté

    return NextResponse.json(eleves);
  } catch (err: any) {
    console.error('[API] Erreur dans /api/tuteurs/eleves :', err.message);
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 });
  }
}
