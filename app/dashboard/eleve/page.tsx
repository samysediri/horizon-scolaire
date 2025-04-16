'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardEleve() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [eleve, setEleve] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('Chargement...');

  useEffect(() => {
    const fetchData = async () => {
      setDebug('🔄 Vérification utilisateur...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setDebug(`❌ Utilisateur non connecté : ${userError?.message || ''}`);
        router.push('/login');
        return;
      }

      setDebug(`✅ Utilisateur ID : ${user.id}`);

      const { data: profil, error: profilError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profilError) {
        setDebug(`❌ Erreur chargement élève : ${profilError.message}`);
        return;
      }

      if (!profil) {
        setDebug(`❌ Aucun élève trouvé pour l'ID : ${user.id}`);
        return;
      }

      setEleve(profil);
      setDebug('🎉 Élève chargé');
      setLoading(false);
    };

    fetchData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <p className="p-6 text-gray-500">{debug}</p>;
  if (!eleve) return <p className="p-6 text-red-500">{debug}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue {eleve.prenom} {eleve.nom}</h1>
      <p className="mb-2">📧 {eleve.email}</p>
      <p className="mb-2">🎯 Lien Lessonspace : <a href={eleve.lien_lessonspace} className="text-blue-600 underline">{eleve.lien_lessonspace}</a></p>

      <div className="mt-6">
        <Link href="/dashboard/eleve/horaire" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          🗓️ Voir mon horaire
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Se déconnecter
      </button>

      <div className="mt-4 text-sm text-gray-500">✅ {debug}</div>
    </div>
  );
}
