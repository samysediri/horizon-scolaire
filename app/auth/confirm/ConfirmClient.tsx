'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const confirm = async () => {
      const code = searchParams.get('code')
      const supabase = createClient()

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          router.push('/dashboard/tuteur')
        } else {
          console.error('Erreur de session Supabase :', error)
        }
      }
    }

    confirm()
  }, [searchParams, router])

  return <p>Confirmation en cours...</p>
}
