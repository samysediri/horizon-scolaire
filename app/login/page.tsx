// app/login/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    if (!email) {
      setError('Veuillez entrer votre adresse courriel.')
      return
    }
    if (!password) {
      setError('Veuillez entrer votre mot de passe.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError('Invalid login credentials')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div>
      <h1>Connexion</h1>
      <input
        type="email"
        placeholder="Adresse courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Se connecter</button>
      <button onClick={() => router.push('/reset-password')}>Mot de passe oublié ?</button>
    </div>
  )
}
