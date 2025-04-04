'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Chargement...')

  useEffect(() => {
    const run = async () => {
      const supabase = createBrowserClient()

      console.log('➡️ document.cookie =', document.cookie)

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (exchangeError) {
        console.error('Erreur de session:', exchangeError.message)
        setMessage('Session invalide ou expirée.')
      } else {
        setMessage('Session établie! Redirection...')
        // Redirige vers le tableau de bord ou autre page pertinente
        window.location.href = '/dashboard'
      }
    }

    run()
  }, [])

  return <p>{message}</p>
}
