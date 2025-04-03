'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const client = createClient();

  useEffect(() => {
    if (code) {
      client.auth.exchangeCodeForSession(code);
    }
  }, [code]);

  return <div>Connexion en cours...</div>;
}
