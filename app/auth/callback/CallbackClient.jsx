'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');

  useEffect(() => {
    const supabase = createClient();

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.push('/dashboard');
      });
    }
  }, [code]);

  return <p>Connexion en cours...</p>;
}
