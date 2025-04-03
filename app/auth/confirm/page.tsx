'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const confirmEmail = async () => {
      const supabase = createClient()
      const code = searchParams.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
          router.push('/dashboard/tuteur')
        } else {
          console.error('Exchange error:', error)
        }
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div style={{ padding: '2rem' }}>
      <p>Redirection en cours...</p>
    </div>
  )
}
