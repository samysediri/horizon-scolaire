// app/auth/confirm/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Connexion en cours...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const confirm = async () => {
      const code = searchParams.get('code')
      const type = searchParams.get('type')

      if (!code || !type) {
        setMessage('Paramètres manquants dans l’URL.')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession({ code })

      if (error) {
        setMessage('Erreur de connexion. Lien invalide ou expiré.')
        console.error(error)
        return
      }

      setMessage('Connexion réussie ! Redirection...')
      router.push('/dashboard/tuteur') // ou vers la page de ton choix
    }

    confirm()
  }, [searchParams])

  return <div>{message}</div>
}
