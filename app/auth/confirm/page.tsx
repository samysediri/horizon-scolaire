'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      console.log('➡️ document.cookie =', document.cookie)

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession()
      if (exchangeError) {
        console.error('Erreur de session:', exchangeError.message)
        setError('Session invalide ou expirée.')
        return
      }

      router.push('/dashboard') // ou toute autre redirection
    }

    run()
  }, [supabase, router])

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Confirmation de l’invitation</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-gray-600">Connexion en cours...</p>
      )}
    </div>
  )
}
