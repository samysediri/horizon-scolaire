'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleUpdate = async () => {
    setStatus('idle');
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus('error');
      setError(error.message);
    } else {
      setStatus('success');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">🔑 Choisir un nouveau mot de passe</h1>

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
        >
          Mettre à jour le mot de passe
        </button>

        {status === 'success' && <p className="text-green-600 mt-4 text-center">Mot de passe mis à jour! Redirection...</p>}
        {status === 'error' && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
