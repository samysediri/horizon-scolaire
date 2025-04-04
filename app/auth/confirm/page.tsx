'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Chargement...')
  
  useEffect(() => {
    const supabase = createBrowserClient()

    const run = async () => {
      if (typeof window === 'undefined') return

      const { error } = await supabase.auth.exchangeCodeForSession()

      if (error) {
        console.error('Erreur de session:', error.message)
        setMessage('Session invalide ou expirée.')
      } else {
        setMessage('🎉 Ton compte a bien été activé!')
      }
    }

    run()
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>{message}</h1>
    </div>
  )
}
