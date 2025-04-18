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
    const nextUrl = window.location.href;

    if (code) {
      supabase.auth
        .exchangeCodeForSession({ url: nextUrl }) // 👈 ici on passe { url }
        .then(() => {
          router.push('/auth/confirm'); // ou dashboard dynamique selon le rôle
        })
        .catch(() => {
          router.push('/login');
        });
    }
  }, [router, searchParams]);

  return (
    <div className="p-6 text-center">
      <p className="text-lg">Connexion en cours...</p>
    </div>
  );
}
