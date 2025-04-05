'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const run = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        console.error('Erreur de session:', error.message)
      } else {
        router.push('/') // Redirige vers la page d’accueil ou dashboard
      }
    }

    run()
  }, [supabase, router])

  return <p>Connexion en cours...</p>
}
