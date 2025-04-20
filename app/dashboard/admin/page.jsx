'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardAdmin() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleTestFacturation = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/stripe/charge-factures');
      const data = await res.json();

      if (res.ok) {
        setResult('✅ Factures test chargées avec succès.');
      } else {
        setResult(`❌ Erreur : ${data.error || 'Inconnue'}`);
      }
    } catch (err) {
      console.error(err);
      setResult('❌ Erreur réseau');
    }

    setLoading(false);
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
          onClick={handleTestFacturation}
          disabled={loading}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? 'Traitement en cours...' : '💳 Tester facturation Stripe'}
        </button>

        {result && (
          <p className={`text-sm ${result.startsWith('✅') ? 'text-green-700' : 'text-red-700'}`}>
            {result}
          </p>
        )}

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
