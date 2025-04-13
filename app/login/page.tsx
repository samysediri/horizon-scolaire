'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const handleLogin = async () => {
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError("Connexion échouée : " + error.message)
      return
    }

    // Redirection vers /dashboard qui redirige ensuite selon le rôle
    router.push('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Connexion</h1>

      <input
        className="w-full mb-2 p-2 border rounded"
        type="email"
        placeholder="Adresse courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        id="email"
      />

      <input
        className="w-full mb-4 p-2 border rounded"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        id="password"
      />

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Se connecter
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
