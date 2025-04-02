'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Callback() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const supabase = createClient()

  useEffect(() => {
    const url = new URL(window.location.href)
    supabase.auth
      .exchangeCodeForSession(url)
      .then(() => {
        window.location.href = '/dashboard/tuteur'
      })
      .catch((err) => {
        console.error('Error exchanging code for session:', err)
      })
  }, [supabase])

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return <p>Connexion en cours...</p>
}
