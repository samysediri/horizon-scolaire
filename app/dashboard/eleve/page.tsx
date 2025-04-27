'use client';

import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EleveDashboard() {
  const user = useUser();
  const [ready, setReady] = useState(false);
  const [prenom, setPrenom] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      // On prend le prénom à partir des métadonnées si disponible
      const metaPrenom = user.user_metadata?.prenom || '';
      setPrenom(metaPrenom);
    }
  }, [user]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bienvenue{prenom ? `, ${prenom}` : ''} !
            </h1>
            <p className="text-gray-500 text-sm">Tableau de bord Élève</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/eleve/horaire"
            className="bg-[#62B6CB] hover:bg-[#539eb1] text-white py-6 px-4 rounded-lg flex flex-col justify-center items-center text-center shadow"
          >
            🗓️
            <span className="mt-2 font-semibold">Voir mon horaire</span>
          </Link>
          <Link
            href="/dashboard/eleve/cours"
            className="bg-[#5390D9] hover:bg-[#4479b3] text-white py-6 px-4 rounded-lg flex flex-col justify-center items-center text-center shadow"
          >
            📚
            <span className="mt-2 font-semibold">Voir mes cours</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
