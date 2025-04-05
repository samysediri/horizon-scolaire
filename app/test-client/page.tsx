'use client'

import { createClient } from '@/lib/supabase/client'

export default function TestClientPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  alert(`✅ TEST PAGE CHARGÉE\nURL: ${supabaseUrl}\nKEY: ${supabaseKey?.slice(0, 8)}...`)

  const supabase = createClient()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Page de test client</h1>
      <p>Si tu vois cette page + une alerte, Supabase s'est chargé côté client.</p>
    </main>
  )
}
