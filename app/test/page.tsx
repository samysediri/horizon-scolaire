'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestPage() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('profiles') // ou une table que tu sais exister dans ta DB
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          setMessage('❌ Erreur: ' + error.message)
        } else {
          setMessage('✅ Connexion Supabase réussie!')
        }
      })
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Supabase</h1>
      <p>{message}</p>
    </div>
  )
}
