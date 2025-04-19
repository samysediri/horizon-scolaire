'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export default function DashboardAdmin() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

      <div className="flex flex-col space-y-4 w-64">
        <Link
          href="/dashboard/admin/inviter-utilisateur"
          className="bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700"
        >
          Inviter un utilisateur
        </Link>

        <Link
          href="/dashboard/admin/lier-tuteur-eleve"
          className="bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700"
        >
          Lier tuteur et élève
        </Link>

        <Link
          href="/dashboard/admin/lier-eleve-parent"
          className="bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700"
        >
          Lier élève et parent
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
