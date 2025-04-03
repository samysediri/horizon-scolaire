'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
;

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const supabase = createClient();

    async function handleSignIn() {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Erreur de session:', error);
        return;
      }
      router.push('/dashboard');
    }

    if (code) handleSignIn();
  }, [code, router]);

  return <p>Connexion en cours...</p>;
}
