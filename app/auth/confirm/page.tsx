'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Chargement...')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession({ currentUrl: window.location.href })

      if (error) {
        console.error('Erreur de session:', error.message)
        setMessage('Session invalide ou expirée.')
      } else {
        setMessage('Connexion réussie! Redirection...')
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }
    }

    run()
  }, [])

  return <p>{message}</p>
}

