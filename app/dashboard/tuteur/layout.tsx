'use client';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TuteurLayout({ children }: { children: React.ReactNode }) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Barre de navigation */}
      <header className="bg-[#0D1B2A] text-white shadow-md py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          {/* Partie gauche : Logo + Liens */}
          <div className="flex items-center gap-6">
            {/* LOGO */}
            <Link href="/dashboard/tuteur">
              <img
                src="/logo.jpg"
                alt="Logo Horizon Scolaire"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Liens */}
            <nav className="flex gap-6 text-sm font-semibold">
              <Link href="/dashboard/tuteur" className="hover:text-[#62B6CB] transition-colors">
                🏠 Accueil
              </Link>
              <Link href="/dashboard/tuteur/eleves" className="hover:text-[#62B6CB] transition-colors">
                👩‍🎓 Mes élèves
              </Link>
              <Link href="/dashboard/tuteur/horaire" className="hover:text-[#62B6CB] transition-colors">
                🗓️ Mon horaire
              </Link>
            </nav>
          </div>

          {/* Bouton Déconnexion */}
          <button
            onClick={handleLogout}
            className="bg-[#E5C07B] hover:bg-[#D4AF37] text-[#0D1B2A] font-bold py-2 px-4 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
