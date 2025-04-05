'use client'

import { useState } from 'react'
import { createBrowserClient as createClient } from '@/lib/supabase/client'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage('Erreur lors de l’envoi du lien.')
    } else {
      setMessage('Lien envoyé! Va voir tes courriels.')
    }
  }

  return (
    <div>
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Adresse courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Envoyer le lien magique</button>
      <p>{message}</p>
    </div>
  )
}
