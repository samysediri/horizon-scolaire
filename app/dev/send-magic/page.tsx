'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function SendMagicPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createBrowserSupabaseClient()

  const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://https://horizon-scolaire.vercel.app',
      },
    })

    if (error) {
      alert('Erreur: ' + error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Envoyer un Magic Link</h1>
      <input
        type="email"
        placeholder="Adresse courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendMagicLink} style={{ marginLeft: 10 }}>
        Envoyer
      </button>
      {sent && <p>✅ Courriel envoyé à {email}</p>}
    </div>
  )
}
