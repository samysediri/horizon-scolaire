'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';

export default function TuteurDashboard() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [salaire, setSalaire] = useState<number | null>(null);
  const [heuresCumulees, setHeuresCumulees] = useState<number | null>(null);
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
      const startMonth = formatISO(startOfMonth(now));
      const endMonth = formatISO(endOfMonth(now));

      // Récupérer les séances complétées de ce mois-ci
      const { data: seancesMois } = await supabase
        .from('seances')
        .select('duree_reelle')
        .eq('tuteur_id', user.id)
        .eq('completee', true)
        .gte('date', startMonth)
        .lte('date', endMonth);

      // Récupérer toutes les séances complétées depuis le début
      const { data: seancesTotal } = await supabase
        .from('seances')
        .select('duree_reelle')
        .eq('tuteur_id', user.id)
        .eq('completee', true);

      // Aller chercher les infos du tuteur
      const { data: tuteur } = await supabase
        .from('tuteurs')
        .select('taux_horaire, prenom, nom')
        .eq('id', user.id)
        .single();

      if (!tuteur?.taux_horaire) return;

      // Calcul salaire estimé du mois
      const totalMinutesMois = seancesMois?.reduce((acc, s) => acc + (s.duree_reelle || 0), 0) || 0;
      const salaireEstime = (totalMinutesMois / 60) * tuteur.taux_horaire;

      // Calcul heures cumulées depuis tout début
      const totalMinutesTotal = seancesTotal?.reduce((acc, s) => acc + (s.duree_reelle || 0), 0) || 0;
      const heuresTotal = totalMinutesTotal / 60;

      setSalaire(salaireEstime);
      setHeuresCumulees(heuresTotal);
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenue{nomComplet ? `, ${nomComplet}` : ''} !
            </h1>
            <p className="text-gray-500 text-sm">Tableau de bord Tuteur</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#E5C07B] hover:bg-[#D4AF37] text-[#0D1B2A] font-bold py-2 px-4 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salaire !== null && (
            <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-6 text-center shadow">
              <p className="font-semibold text-lg mb-2">💵 Solde estimé pour {moisTexte}</p>
              <p className="text-2xl font-bold text-black">{salaire.toFixed(2)} $</p>
            </div>
          )}

          {heuresCumulees !== null && (
            <div className="bg-blue-50 border border-blue-300 text-blue-800 rounded-lg p-6 text-center shadow">
              <p className="font-semibold text-lg mb-2">⏳ Heures complétées depuis le début</p>
              <p className="text-2xl font-bold text-black">{heuresCumulees.toFixed(1)} h</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 text-sm">
          <Link
            href="/dashboard/tuteur/eleves"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded text-center shadow w-full"
          >
            📚 Voir mes élèves
          </Link>
          <Link
            href="/dashboard/tuteur/horaire"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded text-center shadow w-full"
          >
            📅 Voir mon horaire
          </Link>
          <Link
            href="/dashboard/tuteur/heures"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded text-center shadow w-full"
          >
            🕒 Voir mes heures complétées
          </Link>
        </div>

        {isAdmin && (
          <div className="mt-6">
            <Link
              href="/dashboard/admin"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded text-center shadow w-full block"
            >
              🔐 Accéder au tableau de bord Admin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
