'use client'

export default function TestClientEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧪 Test d'environnement</h1>
      <p><strong>URL Supabase:</strong> {supabaseUrl || '❌ Non défini'}</p>
      <p><strong>Clé Anon:</strong> {supabaseKey ? '✅ Définie' : '❌ Non définie'}</p>
    </div>
  )
}
