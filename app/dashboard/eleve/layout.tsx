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
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/dashboard/eleve" className="hover:text-[#62B6CB]">
              🏠 Accueil
            </Link>
            <Link href="/dashboard/eleve/horaire" className="hover:text-[#62B6CB]">
              🗓️ Mon horaire
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#E5C07B] text-[#0D1B2A] hover:bg-[#D4AF37] font-bold py-2 px-4 rounded-lg"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu */}
      <main className="flex-grow bg-[#F8FAFC] p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
