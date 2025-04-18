'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const exchange = async () => {
      const supabase = createPagesBrowserClient();

      if (!code) {
        router.replace('/login');
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data?.session?.user) {
        router.replace('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (!profile || !profile.role) {
        router.replace('/login');
        return;
      }

      switch (profile.role) {
        case 'admin':
          router.replace('/dashboard/admin');
          break;
        case 'tuteur':
          router.replace('/dashboard/tuteur');
          break;
        case 'eleve':
          router.replace('/dashboard/eleve');
          break;
        case 'parent':
          router.replace('/dashboard/parent');
          break;
        default:
          router.replace('/login');
      }
    };

    exchange();
  }, [code, router]);

  return (
    <div className="flex items-center justify-center h-screen text-lg">
      Redirection en cours...
    </div>
  );
}
