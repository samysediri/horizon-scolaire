'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ConfirmClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get('code')
    const token = searchParams.get('access_token')

    if (code || token) {
      router.push('/dashboard/tuteur')
    }
  }, [searchParams, router])

  return <p>Redirection...</p>
}
