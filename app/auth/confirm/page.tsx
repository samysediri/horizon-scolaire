'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    if (token && type === 'signup') {
      router.push('/dashboard/tuteur')
    } else {
      router.push('/')
    }
  }, [searchParams, router])

  return <div>Confirmation en cours...</div>
}
