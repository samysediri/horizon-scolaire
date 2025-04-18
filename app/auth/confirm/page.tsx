'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(async ({ data, error }) => {
          if (error) {
            console.error('Erreur lors de la connexion :', error.message);
            router.push('/login');
          } else {
            // Récupérer le rôle pour rediriger
            const { data: { user } } = await supabase.auth.getUser();
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user?.id)
              .single();

            if (profile?.role === 'admin') router.push('/dashboard/admin');
            else if (profile?.role === 'tuteur') router.push('/dashboard/tuteur');
            else if (profile?.role === 'eleve') router.push('/dashboard/eleve');
            else if (profile?.role === 'parent') router.push('/dashboard/parent');
            else router.push('/');
          }
        });
    }
  }, [searchParams, supabase, router]);

  return <p className="p-4">Connexion en cours…</p>;
}
