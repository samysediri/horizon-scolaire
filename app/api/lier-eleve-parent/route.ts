// app/api/lier-eleve-parent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eleve_id, parent_id } = body;

    if (!eleve_id || !parent_id) {
      return NextResponse.json({ error: 'Élève ou parent manquant' }, { status: 400 });
    }

    const { error } = await supabase
      .from('eleves')
      .update({ parent_id })
      .eq('id', eleve_id);

    if (error) {
      console.error('[API] Erreur liaison élève-parent:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur serveur: ' + err.message }, { status: 500 });
  }
}
