'use client';

import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export default function EleveDashboard() {
  const user = useUser();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bienvenue{user?.user_metadata?.prenom ? `, ${user.user_metadata.prenom}` : ''} !
            </h1>
            <p className="text-gray-500 text-sm">Tableau de bord Élève</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
          <Link
            href="/dashboard/eleve/horaire"
            className="bg-[#5390D9] hover:bg-[#4479b3] text-white py-2 px-4 rounded text-center shadow"
          >
            🗓️ Voir mon horaire
          </Link>
        </div>
      </div>
    </div>
  );
}
