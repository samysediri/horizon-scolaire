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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/dashboard/tuteur" className="hover:text-blue-600">🏠 Accueil</Link>
          <Link href="/dashboard/tuteur/eleves" className="hover:text-blue-600">👩‍🎓 Mes élèves</Link>
          <Link href="/dashboard/tuteur/horaire" className="hover:text-blue-600">🗓️ Mon horaire</Link>
          <Link href="/dashboard/tuteur/heures" className="hover:text-blue-600">⏱️ Heures complétées</Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
