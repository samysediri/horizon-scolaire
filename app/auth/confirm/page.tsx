'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createPagesBrowserClient();

    // Appelle la méthode pour échanger le code d'auth contre une session
    supabase.auth
      .exchangeCodeForSession()
      .then(() => {
        router.push('/auth/confirm');
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router, searchParams]);

  return (
    <div className="p-6 text-center">
      <p className="text-lg">Connexion en cours...</p>
    </div>
  );
}
