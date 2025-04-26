'use client';

import { useUser } from '@supabase/auth-helpers-react';

export default function AccueilParent() {
  const user = useUser();

  return (
    <div className="p-8 min-h-screen bg-[#F8FAFC] flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-[#0D1B2A] mb-6">🎓 Bienvenue sur votre Espace Parent</h1>
        <p className="text-lg text-gray-700 mb-8">
          Gérez facilement l'horaire et les factures de vos enfants avec notre plateforme intuitive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/dashboard/parent/horaire" className="p-6 bg-[#62B6CB] hover:bg-[#4FA3BA] rounded-lg shadow text-white font-semibold text-lg flex flex-col items-center transition">
            📅 Consulter l'horaire
            <span className="mt-2 text-sm font-normal">Voir les séances prévues pour vos enfants</span>
          </a>

          <a href="/dashboard/parent/factures" className="p-6 bg-[#62B6CB] hover:bg-[#4FA3BA] rounded-lg shadow text-white font-semibold text-lg flex flex-col items-center transition">
            💵 Voir mes factures
            <span className="mt-2 text-sm font-normal">Suivre vos paiements et facturations</span>
          </a>
        </div>

        <div className="mt-10">
          <p className="text-gray-500 text-sm">Connecté en tant que :</p>
          <p className="text-[#0D1B2A] font-semibold">{user?.email || 'Chargement...'}</p>
        </div>
      </div>
    </div>
  );
}
