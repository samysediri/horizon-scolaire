'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (exchangeError) {
        console.error('Erreur de session:', exchangeError.message)
        setError("Session invalide ou expirée.")
      } else {
        router.push('/dashboard') // Change cette route si tu veux aller ailleurs
      }
    }

    run()
  }, [supabase, router])

  return (
    <div className="p-6">
      {error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : (
        <p>Connexion en cours...</p>
      )}
    </div>
  )
}
