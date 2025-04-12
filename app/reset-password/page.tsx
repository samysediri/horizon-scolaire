// app/reset-password/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async () => {
    setMessage('')
    setError('')

    if (!email) {
      setError('Veuillez entrer votre adresse courriel.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password` // À créer ensuite
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Un lien de réinitialisation a été envoyé à votre adresse courriel.')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Réinitialiser le mot de passe</h1>
      <input
        type="email"
        placeholder="Adresse courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleReset}>Envoyer</button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
