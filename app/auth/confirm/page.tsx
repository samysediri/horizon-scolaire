'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ConfirmPage() {
  const [message, setMessage] = useState('Vérification en cours...')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const confirm = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (error) {
        setMessage('Erreur de connexion. Lien invalide ou expiré.')
        console.error(error)
      } else {
        setMessage('Connexion réussie! Redirection en cours...')
        setTimeout(() => router.push('/dashboard/tuteur'), 2000) // change ça selon ton besoin
      }
    }

    confirm()
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{message}</h1>
    </main>
  )
}
