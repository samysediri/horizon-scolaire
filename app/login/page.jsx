'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Vérifie ton courriel pour le lien magique ✨')
    }
  }

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Adresse courriel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Envoyer un lien magique</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

