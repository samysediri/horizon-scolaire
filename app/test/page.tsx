'use client'

import { useEffect, useState } from 'react'

export default function TestClientEnv() {
  const [ready, setReady] = useState(false)
  const [envVars, setEnvVars] = useState<{ url?: string; key?: string }>({})

  useEffect(() => {
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
    setReady(true)
  }, [])

  if (!ready) return <p>Chargement…</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧪 Test des variables d’environnement côté client</h1>
      <p><strong>URL Supabase:</strong> {envVars.url || '❌ NON DÉFINIE'}</p>
      <p><strong>Clé Anon:</strong> {envVars.key ? '✅ DÉFINIE' : '❌ NON DÉFINIE'}</p>
    </div>
  )
}
