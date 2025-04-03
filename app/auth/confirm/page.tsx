'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    const confirmUser = async () => {
      if (!token || !type) return;

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(token);

      if (error) {
        console.error('Error confirming user:', error);
        return;
      }

      // Rediriger après confirmation
      router.replace('/dashboard/tuteur');
    };

    confirmUser();
  }, [token, type, router]);

  return <p>Confirmation en cours...</p>;
}
