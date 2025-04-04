'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const run = async () => {
      console.log('➡️ document.cookie =', document.cookie)

     supabase.auth.exchangeCodeForSession(window.location.href)


      if (exchangeError) {
        console.error('Erreur de session:', exchangeError.message)
        setError('Session invalide ou expirée.')
        return
      }

      router.push('/dashboard/tuteur') // ou ton dashboard par défaut
    }

    run()
  }, [])

  if (error) {
    return <p>{error}</p>
  }

  return <p>Connexion en cours...</p>
}
