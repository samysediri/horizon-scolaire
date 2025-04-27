'use client';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EleveLayout({ children }: { children: React.ReactNode }) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barre de navigation */}
      <nav className="bg-[#0D1B2A] text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/dashboard/eleve" className="hover:text-[#62B6CB] flex items-center gap-2">
              🏠 Accueil
            </Link>
            <Link href="/dashboard/eleve/horaire" className="hover:text-[#62B6CB] flex items-center gap-2">
              📅 Mon horaire
            </Link>
            <Link href="/dashboard/eleve/cours" className="hover:text-[#62B6CB] flex items-center gap-2">
              📚 Mes cours
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#E5C07B] hover:bg-[#D4AF37] text-[#0D1B2A] font-bold py-2 px-4 rounded-lg text-sm"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-grow bg-[#F8FAFC] p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
