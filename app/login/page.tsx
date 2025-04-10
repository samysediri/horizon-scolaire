'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = useSupabaseClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
console.log('Tentative de connexion avec:', email, password) // 👈 ajoute ça
    if (!email || !password) {
      setError("Veuillez entrer votre adresse courriel et votre mot de passe.")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
console.log('Résultat connexion:', error) // 👈 et ça
    if (error) {
      setError("Informations incorrectes")
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Se connecter</button>
      <button onClick={() => router.push('/reset-password')}>Mot de passe oublié ?</button>
    </div>
  )
}
