'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navbar */}
      <header className="bg-[#0D1B2A] text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-6 text-sm sm:text-base">
            <a href="/dashboard/parent" className="hover:text-[#62B6CB] font-semibold flex items-center gap-1">
              🏠 Accueil
            </a>
            <a href="/dashboard/parent/horaire" className="hover:text-[#62B6CB] font-semibold flex items-center gap-1">
              📅 Horaire
            </a>
            <a href="/dashboard/parent/factures" className="hover:text-[#62B6CB] font-semibold flex items-center gap-1">
              💵 Factures
            </a>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#F4D35E] hover:bg-[#E5C07B] text-[#0D1B2A] font-bold py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow p-6 sm:p-10 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
