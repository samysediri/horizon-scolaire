'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');

  useEffect(() => {
    const supabase = createClient();

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.push('/dashboard'); // Redirige vers /dashboard après login
      });
    }
  }, [code, router]);

  return <p>Connexion en cours...</p>;
}
