'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TuteurDashboard() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [ready, setReady] = useState(false);
  const [salaire, setSalaire] = useState<number | null>(null);
  const [heuresTotales, setHeuresTotales] = useState<number | null>(null);
  const [nomComplet, setNomComplet] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const fetchInfosTuteur = async () => {
      if (!user?.id) return;

      const now = new Date();
      const debutMois = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      // Récupère toutes les séances complétées du tuteur
      const { data: seances } = await supabase
        .from('seances')
        .select('duree_reelle, debut, completee')
        .eq('tuteur_id', user.id)
        .eq('completee', true);

      const { data: tuteur } = await supabase
        .from('tuteurs')
        .select('taux_horaire, prenom, nom')
        .eq('id', user.id)
        .single();

      if (!seances || !tuteur) return;

      // Filtrer celles du mois en cours
      const seancesMois = seances.filter(s => {
        const dateDebut = new Date(s.debut);
        return dateDebut >= new Date(debutMois) && dateDebut <= new Date(finMois);
      });

      const totalMinutesMois = seancesMois.reduce((acc, s) => acc + (s.duree_reelle || 0), 0);
      const totalMinutesTotales = seances.reduce((acc, s) => acc + (s.duree_reelle || 0), 0);

      setSalaire((totalMinutesMois / 60) * tuteur.taux_horaire);
      setHeuresTotales(totalMinutesTotales / 60);
      setNomComplet(`${tuteur.prenom || ''} ${tuteur.nom || ''}`.trim());
    };

    fetchInfosTuteur();
  }, [user]);

  if (!ready) return null;

  const moisTexte = new Date().toLocaleDateString('fr-CA', { month: 'long' });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bienvenue{nomComplet ? `, ${nomComplet}` : ''} !
            </h1>
            <p className="text-gray-500 text-sm">Tableau de bord Tuteur</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salaire !== null && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-6 rounded text-center">
              <p className="text-sm">Solde estimé pour {moisTexte}</p>
              <p className="text-2xl font-bold text-black">{salaire.toFixed(2)} $</p>
            </div>
          )}

          {heuresTotales !== null && (
            <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-6 rounded text-center">
              <p className="text-sm">Heures complétées depuis le début</p>
              <p className="text-2xl font-bold text-black">{heuresTotales.toFixed(1)} h</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
          <Link
            href="/dashboard/tuteur/eleves"
            className="bg-[#62B6CB] hover:bg-[#539eb1] text-white py-2 px-4 rounded text-center shadow"
          >
            📚 Voir mes élèves
          </Link>
          <Link
            href="/dashboard/tuteur/horaire"
            className="bg-[#5390D9] hover:bg-[#4479b3] text-white py-2 px-4 rounded text-center shadow"
          >
            🗓️ Voir mon horaire
          </Link>
        </div>
      </div>
    </div>
  );
}
