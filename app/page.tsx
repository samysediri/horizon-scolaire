'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const redirectUrl = '/auth/confirm' + hash;
      router.replace(redirectUrl);
    }
  }, [router]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Bienvenue sur Horizon Scolaire!</h1>
      <p className="mt-4">Page d’accueil temporaire pour tester le déploiement.</p>
      <a href="/auth/confirm" className="text-blue-500 underline mt-4 inline-block">
        👉 Tester la page /auth/confirm
      </a>
    </main>
  );
}
