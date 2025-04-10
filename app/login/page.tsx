'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError('Veuillez entrer votre courriel et votre mot de passe.')
      return
    }

    console.log('Tentative de connexion avec:', email)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Erreur de connexion :', error.message)
      setError('Courriel ou mot de passe invalide.')
    } else {
      console.log('Connexion réussie!')
      router.push('/dashboard')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>

      <input
        type="email"
        placeholder="Adresse courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex gap-4 items-center">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>

        <button
          onClick={() => router.push('/reset-password')}
          className="text-sm text-gray-600 underline"
        >
          Mot de passe oublié ?
        </button>
      </div>

      <p className="mt-6 text-sm">
        Pas encore de compte ?{' '}
        <a href="/signup" className="text-blue-600 underline">
          Créer un compte
        </a>
      </p>
    </div>
  )
}
