// app/login/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const supabase = createClient()


  const handleLogin = async () => {
    setStatus('Envoi du lien...')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      setStatus(`Erreur: ${error.message}`)
    } else {
      setStatus('Lien magique envoyé! Vérifie tes courriels.')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Connexion à Horizon Scolaire</h1>
      <p>Entre ton courriel pour recevoir un lien magique :</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="exemple@email.com"
        style={{ padding: 8, fontSize: 16, width: 300 }}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleLogin} style={{ padding: '8px 16px', fontSize: 16 }}>
          Envoyer le lien magique
        </button>
      </div>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  )
}
