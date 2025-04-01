'use client';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function TuteurDashboard() {
  const user = useUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <div>
      <h1>Bienvenue sur le tableau de bord Tuteur</h1>
      {user?.user_metadata?.role === 'admin' && (
        <a href="/dashboard/admin" className="text-blue-500 underline">
          Aller au tableau de bord Admin
        </a>
      )}
    </div>
  );
}
