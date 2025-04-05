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
        router.push('/dashboard') // Redirige si tout est bon
      }
    }

    run()
  }, [router])

  return (
    <div className="p-4">
      <h1 className="text-xl">Connexion...</h1>
    </div>
  )
}
