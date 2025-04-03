'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      router.push('/dashboard/tuteur')
    }
  }, [searchParams, router])

  return <div>Redirection en cours...</div>
}
