'use server'

import { createServerClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function genererFacturesPourMois(mois: number, annee: number) {
  const supabase = createServerClient(cookies());

  const { data: parents, error: parentsError } = await supabase.from('parents').select('id');
  if (parentsError) throw new Error(parentsError.message);

  for (const parent of parents) {
    const { data: enfants, error: enfantsError } = await supabase
      .from('eleves_parents')
      .select('eleve_id')
      .eq('parent_id', parent.id);
    if (enfantsError) throw new Error(enfantsError.message);

    const eleveIds = enfants.map((e) => e.eleve_id);
    if (eleveIds.length === 0) continue;

    const { data: seances, error: seancesError } = await supabase
      .from('seances')
      .select('duree_reelle, tuteur_id, created_at')
      .in('eleve_id', eleveIds)
      .eq('completee', true);
    if (seancesError) throw new Error(seancesError.message);

    const seancesDuMois = seances.filter((s) => {
      const date = new Date(s.created_at);
      return date.getMonth() + 1 === mois && date.getFullYear() === annee;
    });

    let total = 0;
    for (const seance of seancesDuMois) {
      const { data: tuteur, error: tuteurError } = await supabase
        .from('tuteurs')
        .select('taux_horaire')
        .eq('uuid', seance.tuteur_id)
        .single();
      if (tuteurError) throw new Error(tuteurError.message);

      total += (seance.duree_reelle / 60) * tuteur.taux_horaire;
    }

    await supabase.from('factures').insert({
      parent_id: parent.id,
      mois,
      annee,
      montant_total: total,
      payee: false,
    });
  }
}
