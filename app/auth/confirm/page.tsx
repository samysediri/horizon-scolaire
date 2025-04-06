// app/auth/confirm/page.tsx

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
      const { error } = await supabase.auth.exchangeCodeForSession()
      if (error) {
        setMessage('Erreur de connexion. Lien invalide ou expiré.')
        console.error(error)
      } else {
        setMessage('Connexion réussie! Redirection en cours...')
        setTimeout(() => router.push('/dashboard'), 2000) // change ça si t’as une autre page d’arrivée
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
