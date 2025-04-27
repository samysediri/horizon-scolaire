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
  const [salaire, setSalaire] = useState<number | null>(null);
  const [heuresTotal, setHeuresTotal] = useState<number>(0);
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
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data: seancesMois } = await supabase
        .from('seances')
        .select('duree_reelle')
        .eq('tuteur_id', user.id)
        .eq('completee', true)
        .gte('debut', startMonth)
        .lte('debut', endMonth);

      const { data: seancesToutes } = await supabase
        .from('seances')
        .select('duree_reelle')
        .eq('tuteur_id', user.id)
        .eq('completee', true);

      const { data: tuteur } = await supabase
        .from('tuteurs')
        .select('taux_horaire, prenom, nom')
        .eq('id', user.id)
        .single();

      if (!seancesToutes || !tuteur?.taux_horaire) return;

      const totalMinutesMois = (seancesMois || []).reduce((acc, s) => acc + (s.duree_reelle || 0), 0);
      const totalMinutesToutes = (seancesToutes || []).reduce((acc, s) => acc + (s.duree_reelle || 0), 0);

      const salaireEstime = (totalMinutesMois / 60) * tuteur.taux_horaire;
      const heuresCumulees = totalMinutesToutes / 60;

      setSalaire(salaireEstime);
      setHeuresTotal(heuresCumulees);
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
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bienvenue{nomComplet ? `, ${nomComplet}` : ''} !
            </h1>
            <p className="text-gray-500 text-sm">Tableau de bord Tuteur</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-100 border border-green-300 text-center rounded-lg p-6">
            <p className="text-sm text-gray-600">Solde estimé pour {moisTexte}</p>
            <p className="text-2xl font-bold mt-2">{salaire !== null ? `${salaire.toFixed(2)} $` : '...'}</p>
          </div>

          <div className="bg-blue-100 border border-blue-300 text-center rounded-lg p-6">
            <p className="text-sm text-gray-600">Heures complétées depuis le début</p>
            <p className="text-2xl font-bold mt-2">{heuresTotal.toFixed(1)} h</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/tuteur/eleves"
            className="bg-[#62B6CB] hover:bg-[#5399ad] text-white py-2 px-6 rounded text-center shadow"
          >
            📚 Voir mes élèves
          </Link>
          <Link
            href="/dashboard/tuteur/horaire"
            className="bg-[#3C096C] hover:bg-[#5A189A] text-white py-2 px-6 rounded text-center shadow"
          >
            🗓️ Voir mon horaire
          </Link>
          <Link
            href="/dashboard/tuteur/heures"
            className="bg-[#5F0F40] hover:bg-[#9A031E] text-white py-2 px-6 rounded text-center shadow"
          >
            ⏱️ Voir mes heures complétées
          </Link>
        </div>
      </div>
    </div>
  );
}
