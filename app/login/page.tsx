'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createClientComponentClient<Database>();

  const handleLogin = async () => {
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Connexion échouée : " + error.message);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile?.role) {
      setError("Rôle introuvable");
      return;
    }

    switch (profile.role) {
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'tuteur':
        router.push('/dashboard/tuteur');
        break;
      case 'eleve':
        router.push('/dashboard/eleve');
        break;
      case 'parent':
        router.push('/dashboard/parent');
        break;
      default:
        setError("Rôle non reconnu");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src="/logo.jpg" alt="Logo Horizon Scolaire" className="h-20 object-contain" />
        </div>

        {/* TITRE */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h1>

        {/* CHAMPS */}
        <input
          className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          placeholder="Adresse courriel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {/* BOUTON */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          onClick={handleLogin}
        >
          Se connecter
        </button>

        {/* MOT DE PASSE OUBLIÉ */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/reset-password-request')}
            className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
          >
            🔐 Mot de passe oublié ?
          </button>
        </div>

        {/* MESSAGE D'ERREUR */}
        {error && <p className="text-red-600 mt-4 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
