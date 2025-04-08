'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Confirmation en cours...')
  const supabase = createClient()

  useEffect(() => {
    const confirm = async () => {
      const code = searchParams.get('code')
      const type = searchParams.get('type')

      if (!code || !type) {
        setMessage('Lien invalide ou manquant.')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession({ code })

      if (error) {
        console.error(error)
        setMessage('Erreur de connexion. Lien invalide ou expiré.')
        return
      }

      setMessage('Connexion réussie ! Redirection...')
      router.push('/dashboard/tuteur') // change selon le rôle
    }

    confirm()
  }, [searchParams])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Confirmation du compte</h1>
      <p>{message}</p>
    </div>
  )
}
