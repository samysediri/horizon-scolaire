'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useState, Suspense } from 'react';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createPagesBrowserClient();
  const { isLoading } = useSessionContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exchangeCodeForSession = async () => {
      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError(error.message);
        } else {
          const { data: { user } } = await supabase.auth.getUser();

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user?.id)
            .single();

          if (profileError || !profile) {
            router.push('/login');
          } else {
            const role = profile.role;
            if (role === 'admin') router.push('/dashboard/admin');
            else if (role === 'tuteur') router.push('/dashboard/tuteur');
            else if (role === 'parent') router.push('/dashboard/parent');
            else if (role === 'eleve') router.push('/dashboard/eleve');
            else router.push('/login');
          }
        }
      }
    };

    if (!isLoading) {
      exchangeCodeForSession();
    }
  }, [searchParams, isLoading]);

  if (error) return <p>Erreur : {error}</p>;
  return <p>Connexion en cours...</p>;
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ConfirmContent />
    </Suspense>
  );
}
