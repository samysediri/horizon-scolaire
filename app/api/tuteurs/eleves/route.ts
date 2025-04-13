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
    return NextResponse.json({ error: 'tuteur_id manquant' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tuteurs_eleves')
    .select('eleves(*)')
    .eq('tuteur_id', tuteur_id);

  if (error) {
    console.error('Erreur Supabase :', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const eleves = data.map((entry: any) => entry.eleves);

  return NextResponse.json(eleves);
}
