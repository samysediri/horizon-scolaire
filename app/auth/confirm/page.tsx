'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createPagesBrowserClient();

    // Cette méthode s'occupe de récupérer access_token & refresh_token dans l'URL
    supabase.auth
      .exchangeCodeForSession()
      .then(() => {
        router.push('/auth/confirm');
      })
      .catch(() => {
        router.push('/login');
      });
  }, []);

  return (
    <div className="p-6 text-center">
      <p className="text-lg">Connexion en cours...</p>
    </div>
  );
}
