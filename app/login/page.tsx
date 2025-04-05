'use client'

import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    alert('✅ La page de login se charge bien côté client');

    alert('🔍 NEXT_PUBLIC_SUPABASE_URL: ' + process.env.NEXT_PUBLIC_SUPABASE_URL);
    alert('🔍 NEXT_PUBLIC_SUPABASE_ANON_KEY: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Page de connexion</h1>
      <p>Si vous voyez les alertes, c’est que la page fonctionne côté client.</p>
    </div>
  )
}
