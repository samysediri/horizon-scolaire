'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      router.push(`/auth/callback?code=${code}`);
    }
  }, [searchParams, router]);

  return <p>Redirection en cours...</p>;
}
