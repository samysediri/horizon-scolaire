'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Suspense } from 'react';

function ConfirmRedirector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const doRedirect = async () => {
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

      const redirects: Record<string, string> = {
        admin: '/dashboard/admin',
        tuteur: '/dashboard/tuteur',
        eleve: '/dashboard/eleve',
        parent: '/dashboard/parent',
      };

      router.replace(redirects[profile.role] || '/login');
    };

    doRedirect();
  }, [code, router]);

  return <p className="p-8 text-center text-lg">Connexion en cours...</p>;
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-lg">Chargement...</p>}>
      <ConfirmRedirector />
    </Suspense>
  );
}
