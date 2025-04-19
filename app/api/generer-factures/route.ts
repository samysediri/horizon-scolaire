import { genererFacturesPourMois } from '@/utils/facturation';

export async function POST() {
  try {
    const now = new Date();
    const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const result = await genererFacturesPourMois(mois);

    return Response.json({ success: true, ...result });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
