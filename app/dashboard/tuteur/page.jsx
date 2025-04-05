'use client';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function TuteurDashboard() {
  const user = useUser();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (user?.user_metadata?.role === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  if (!ready) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenue sur le tableau de bord Tuteur</h1>
      {isAdmin && (
        <a href="/dashboard/admin" className="text-blue-600 underline">
          Aller au tableau de bord Admin
        </a>
      )}
    </div>
  );
}
