'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createPagesBrowserClient();

    const code = searchParams.get('code');
    if (!code) return;

    supabase.auth
      .exchangeCodeForSession({ query: { code } })
      .then(() => {
        router.push('/auth/confirm'); // ou vers un dashboard spécifique selon le rôle
      })
      .catch(() => {
        router.push('/login');
      });
  }, [searchParams, router]);

  return (
    <div className="p-6 text-center">
      <p className="text-lg">Connexion en cours...</p>
    </div>
  );
}
