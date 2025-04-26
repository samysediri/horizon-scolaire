'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@supabase/auth-helpers-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Barre de navigation */}
      <header className="bg-[#0D1B2A] text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <a href="/dashboard/parent" className="hover:text-[#62B6CB] font-semibold">
              🏠 Accueil
            </a>
            <a href="/dashboard/parent/horaire" className="hover:text-[#62B6CB] font-semibold">
              📅 Horaire
            </a>
            <a href="/dashboard/parent/factures" className="hover:text-[#62B6CB] font-semibold">
              💵 Factures
            </a>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#E5C07B] text-[#0D1B2A] hover:bg-[#D4AF37] font-bold py-2 px-4 rounded-lg"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-grow bg-[#F8FAFC] p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
