// Fichier : app/api/invite-eleve-parent/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eleve_nom, eleve_email, parent_nom, parent_email } = body;

    if (!eleve_nom || !eleve_email || !parent_nom || !parent_email) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const [eleveRes, parentRes] = await Promise.all([
      supabase.auth.admin.inviteUserByEmail(eleve_email),
      supabase.auth.admin.inviteUserByEmail(parent_email),
    ]);

    if (eleveRes.error) throw eleveRes.error;
    if (parentRes.error) throw parentRes.error;

    const eleve_id = eleveRes.data.user?.id;
    const parent_id = parentRes.data.user?.id;

    if (!eleve_id || !parent_id) {
      return NextResponse.json({ error: "Échec d'invitation" }, { status: 500 });
    }

    await Promise.all([
      supabase.from('profiles').upsert({ id: eleve_id, nom: eleve_nom, email: eleve_email, role: 'eleve' }),
      supabase.from('profiles').upsert({ id: parent_id, nom: parent_nom, email: parent_email, role: 'parent' }),
      supabase.from('parents').upsert({ uuid: parent_id, nom: parent_nom, email: parent_email }),
      supabase.from('eleves').upsert({ uuid: eleve_id, nom: eleve_nom, email: eleve_email }),
      supabase.from('eleves_parents').upsert({ eleve_id, parent_id }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API] Erreur invitation élève/parent :', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
