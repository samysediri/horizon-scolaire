'use client'

import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Chargement...')
  const supabase = createPagesBrowserClient()

  useEffect(() => {
    const run = async () => {
      console.log('➡️ document.cookie =', document.cookie)

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        console.error('Erreur de session:', error.message)
        setMessage('Session invalide ou expirée.')
      } else {
        setMessage('Connexion réussie! Redirection...')
        // window.location.href = '/'
      }
    }

    run()
  }, [supabase])

  return <p>{message}</p>
}
