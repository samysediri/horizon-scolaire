'use client'

export default function Test() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔎 Test des variables d’environnement</h1>
      <p><strong>URL Supabase :</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Non définie'}</p>
      <p><strong>Anon Key :</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Non définie'}</p>
    </div>
  )
}
