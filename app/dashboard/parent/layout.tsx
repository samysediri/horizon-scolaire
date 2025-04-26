'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import Link from 'next/link';

export default function ParentDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Barre de navigation */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/parent" className="text-blue-600 font-semibold hover:underline">
            🏠 Accueil
          </Link>
          <Link href="/dashboard/parent/horaire" className="text-blue-600 font-semibold hover:underline">
            🗓️ Horaire
          </Link>
          <Link href="/dashboard/parent/factures" className="text-blue-600 font-semibold hover:underline">
            💵 Factures
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Déconnexion
        </button>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
