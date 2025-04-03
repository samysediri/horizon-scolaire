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
      // Redirige automatiquement au dashboard tuteur
      router.push('/dashboard/tuteur')
    } else {
      // Sinon tu peux rediriger ailleurs ou afficher un message
      router.push('/')
    }
  }, [searchParams, router])

  return (
    <div>Confirmation en cours...</div>
  )
}
