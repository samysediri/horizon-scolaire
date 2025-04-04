'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const supabase = createBrowserClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const run = async () => {
      console.log('➡️ document.cookie =', document.cookie)

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (exchangeError) {
        console.error('Erreur de session:', exchangeError.message)
        setError('Session invalide ou expirée.')
      } else {
        setSuccess(true)
      }
    }

    run()
  }, [supabase])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        {error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : success ? (
          <p className="text-green-600 font-semibold">Ton compte est maintenant activé! 🎉</p>
        ) : (
          <p className="text-gray-600">Activation de ton compte en cours...</p>
        )}
      </div>
    </div>
  )
}
