'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TuteurDashboard() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [salaireMois, setSalaireMois] = useState<number | null>(null);
  const [heuresTotales, setHeuresTotales] = useState<number | null>(null);
  const [nomComplet, setNomComplet] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (user?.user_metadata?.role === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchInfosTuteur = async () => {
      if (!user?.id) return;

      const now = new Date();
      const debutMois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      const { data: seancesMois } = await supabase
        .from('seances')
        .select('duree_reelle, completee, date')
        .eq('tuteur_id', user.id)
        .eq('completee', true)
        .gte('date', debutMois);

      const { data: seancesTotales } = await supabase
        .from('seances')
        .select('duree_reelle, completee')
        .eq('tuteur_id', user.id)
        .eq('completee', true);

      const { data: tuteur } = await supabase
        .from('tuteurs')
        .select('taux_horaire, prenom, nom')
        .eq('id', user.id)
        .single();

      if (!tuteur?.taux_horaire) return;

      // Calcul du salaire du mois
      const totalMinutesMois = seancesMois?.reduce((acc, s) => acc + (s.duree_reelle || 0), 0) || 0;
      const salaireEstime = (totalMinutesMois / 60) * tuteur.taux_horaire;

      // Calcul des heures totales
      const totalMinutesTotales = seancesTotales?.reduce((acc, s) => acc + (s.duree_reelle || 0), 0) || 0;
      const heuresCumulees = totalMinutesTotales / 60;

      setSalaireMois(salaireEstime);
      setHeuresTotales(heuresCumulees);
      setNomComplet(`${tuteur.prenom || ''} ${tuteur.nom || ''}`.trim());
    };

    fetchInfosTuteur();
  }, [user, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!ready) return null;

  const moisTexte = new Date().toLocaleDateString('fr-CA', { month: 'long' });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl space-y-8">
        {/* En-tête */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenue{nomComplet ? `, ${nomComplet}` : ''} !
            </h1>
            <p className="text-gray-500 text-sm mt-1">Tableau de bord Tuteur</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            Déconnexion
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-300 p-6 rounded-lg flex flex-col items-center justify-center">
            <p className="text-green-800 text-sm mb-2">Solde estimé pour {moisTexte}</p>
            <p className="text-3xl font-bold text-gray-800">{salaireMois !== null ? `${salaireMois.toFixed(2)} $` : '--'}</p>
          </div>

          <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg flex flex-col items-center justify-center">
            <p className="text-blue-800 text-sm mb-2">Heures complétées depuis le début</p>
            <p className="text-3xl font-bold text-gray-800">{heuresTotales !== null ? `${heuresTotales.toFixed(1)} h` : '--'}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <Link
            href="/dashboard/tuteur/eleves"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-center shadow"
          >
            📚 Voir mes élèves
          </Link>
          <Link
            href="/dashboard/tuteur/horaire"
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg text-center shadow"
          >
            🗓️ Voir mon horaire
          </Link>
          <Link
            href="/dashboard/tuteur/heures"
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg text-center shadow"
          >
            ⏱️ Voir mes heures complétées
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg text-center shadow col-span-full"
            >
              🔐 Accéder au tableau de bord Admin
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
