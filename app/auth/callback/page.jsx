'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/ssr';

export default function Callback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const role = session.user.user_metadata.role;
        if (role === 'admin') router.replace('/dashboard/admin');
        else if (role === 'tuteur') router.replace('/dashboard/tuteur');
        else if (role === 'parent') router.replace('/dashboard/parent');
        else router.replace('/dashboard');
      } else {
        router.replace('/connexion');
      }
    });
  }, []);

  return <p>Connexion en cours...</p>;
}
