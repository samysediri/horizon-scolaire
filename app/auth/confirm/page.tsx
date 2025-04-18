'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createPagesBrowserClient();
    const currentUrl = window.location.href;

    supabase.auth
      .exchangeCodeForSession(currentUrl) // ✅ ici on passe directement un string
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
