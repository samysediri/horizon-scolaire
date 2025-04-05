'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestClientPage() {
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    alert(`URL: ${supabaseUrl}`)
    alert(`Key: ${supabaseKey?.slice(0, 8)}...`)

    const supabase = createClient()
    alert('✅ Supabase client créé avec succès')
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Test Client</h1>
      <p>Cette page teste l’accès aux variables d’environnement et à Supabase côté client.</p>
    </main>
  )
}
