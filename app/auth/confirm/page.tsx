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
        router.push('/dashboard') // ou ta page d’accueil après login
      }
    }

    run()
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Connexion en cours...</p>
    </div>
  )
}
