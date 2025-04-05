'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        console.error('Erreur de session:', error.message)
      } else {
        router.push('/dashboard/tuteur')
      }
    }

    run()
  }, [router])

  return <p>Connexion en cours...</p>
}
