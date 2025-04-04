'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Chargement...')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()

      const { error } = await supabase.auth.exchangeCodeForSession()

      if (error) {
        console.error('Erreur de session:', error.message)
        setMessage('Session invalide ou expirée.')
      } else {
        setMessage('Connexion réussie! Redirection...')
        // redirection vers ton dashboard ou page d'accueil
        window.location.href = '/dashboard'
      }
    }

    run()
  }, [])

  return (
    <div style={{ padding: 32 }}>
      <h1>{message}</h1>
    </div>
  )
}
