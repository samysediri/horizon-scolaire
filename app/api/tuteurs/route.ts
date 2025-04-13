// app/api/tuteurs/eleves/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tuteur_id = searchParams.get('tuteur_id');

  if (!tuteur_id) {
    return NextResponse.json({ error: 'Paramètre tuteur_id manquant' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('tuteurs_eleves')
      .select('eleves ( id, nom, email )')
      .eq('tuteur_id', tuteur_id);

    if (error) {
      console.error('[API] Erreur récupération élèves du tuteur:', error.message);
      return NextResponse.json({ error: 'Erreur récupération élèves' }, { status: 500 });
    }

    const eleves = data.map((item: any) => item.eleves);
    return NextResponse.json(eleves);
  } catch (err: any) {
    console.error('[API] Exception:', err.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
