'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const run = async () => {
      console.log('➡️ document.cookie =', document.cookie)

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession({
        currentUrl: window.location.href,
      })

      if (exchangeError) {
        console.error('Erreur de session:', exchangeError.message)
        setError('Session invalide ou expirée.')
      } else {
        router.push('/dashboard')
      }

      setLoading(false)
    }

    if (typeof window !== 'undefined') {
      run()
    }
  }, [])

  if (loading) return <p>Chargement...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return null
}
