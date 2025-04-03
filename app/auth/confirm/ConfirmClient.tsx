'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function ConfirmClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      router.push(`/dashboard/tuteur`)
    }
  }, [searchParams, router])

  return <p>Redirection...</p>
}