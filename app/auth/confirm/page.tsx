'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.exchangeCodeForSession({
  currentUrl: window.location.href
})

      if (error) {
        console.error('Erreur de session:', error.message)
      } else {
        router.push('/dashboard')
      }
    }

    run()
  }, [router])

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Confirmation en cours…</h1>
    </main>
  )
}
