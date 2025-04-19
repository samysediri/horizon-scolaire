// utils/facturation.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function genererFacturesPourMois(mois: string) {
  try {
    const { data: seances, error } = await supabase
      .from('seances')
      .select('id')
      .eq('completee', true)
      .like('debut', `${mois}-%`);

    if (error) throw error;

    let totalCreees = 0;
    for (const seance of seances) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/factures/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seance_id: seance.id }),
      });

      if (res.ok) totalCreees += 1;
    }

    return { totalCreees };
  } catch (err: any) {
    console.error('[genererFacturesPourMois] Erreur :', err.message);
    throw err;
  }
}
