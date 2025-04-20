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
    const fetchSalaire = async () => {
      if (!user?.id) return;

      const now = new Date();
      const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('seances')
        .select('duree_reelle, completee')
        .eq('tuteur_id', user.id)
        .eq('completee', true);

      if (error || !data) return;

      const { data: tuteur } = await supabase
        .from('tuteurs')
        .select('taux_horaire')
        .eq('id', user.id)
        .single();

      if (!tuteur?.taux_horaire) return;

      const totalMinutes = data.reduce((acc, seance) => acc + (seance.duree_reelle || 0), 0);
      const salaireEstime = (totalMinutes / 60) * tuteur.taux_horaire;

      setSalaire(salaireEstime);
    };

    fetchSalaire();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!ready) return null;

  const moisTexte = new Date().toLocaleDateString('fr-CA', { month: 'long' });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bienvenue sur le tableau de bord Tuteur</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded">
          Déconnexion
        </button>
      </div>

      {salaire !== null && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          💰 Solde du mois de <strong>{moisTexte}</strong> : <strong>{salaire.toFixed(2)} $</strong>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href="/dashboard/tuteur/eleves"
          className="block text-blue-600 hover:underline"
        >
          📚 Voir mes élèves
        </Link>

        <Link
          href="/dashboard/tuteur/horaire"
          className="block text-blue-600 hover:underline"
        >
          🗓️ Voir mon horaire
        </Link>

        <Link
          href="/dashboard/tuteur/heures"
          className="block text-blue-600 hover:underline"
        >
          ⏱️ Voir mes heures complétées
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className="block text-green-600 hover:underline mt-4"
          >
            🔐 Accéder au tableau de bord Admin
          </Link>
        )}
      </div>
    </div>
  );
}
