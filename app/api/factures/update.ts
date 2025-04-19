import { NextRequest, NextResponse } from 'next/server';
import { ajouterSeanceDansFacture } from '@/utils/facturation';

export async function POST(req: NextRequest) {
  try {
    const { seance_id } = await req.json();

    if (!seance_id) {
      return NextResponse.json({ error: 'ID de séance manquant' }, { status: 400 });
    }

    await ajouterSeanceDansFacture(seance_id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
