import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fonction pour ajouter une séance dans une facture
export async function ajouterSeanceDansFacture(seance_id: string) {
  const { data: seance, error: seanceError } = await supabase
    .from('seances')
    .select('id, duree_reelle, tuteur_id, eleve_id')
    .eq('id', seance_id)
    .single();

  if (seanceError || !seance) {
    throw new Error('Séance non trouvée');
  }

  const { data: tuteur } = await supabase
    .from('tuteurs')
    .select('taux_horaire')
    .eq('id', seance.tuteur_id)
    .single();

  if (!tuteur?.taux_horaire) {
    throw new Error('Taux horaire non trouvé pour le tuteur');
  }

  const { data: eleve } = await supabase
    .from('eleves')
    .select('parent_id')
    .eq('id', seance.eleve_id)
    .single();

  if (!eleve?.parent_id) {
    throw new Error('Parent introuvable pour cet élève');
  }

  const montant = (seance.duree_reelle / 60) * tuteur.taux_horaire;

  const now = new Date();
  const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { data: factureExistante } = await supabase
    .from('factures')
    .select('*')
    .eq('parent_id', eleve.parent_id)
    .eq('mois', mois)
    .single();

  if (factureExistante) {
    const { error: updateError } = await supabase
      .from('factures')
      .update({ montant: factureExistante.montant + montant })
      .eq('id', factureExistante.id);

    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase.from('factures').insert({
      parent_id: eleve.parent_id,
      mois,
      montant,
      payee: false,
    });

    if (insertError) throw insertError;
  }
}

// Fonction pour générer toutes les factures pour un mois donné
export async function genererFacturesPourMois(mois: string) {
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
}
