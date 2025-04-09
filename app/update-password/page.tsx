'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const supabase = createPagesBrowserClient()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error(error)
          setError('Lien invalide ou expiré.')
        }
      })
    } else {
      setError('Lien invalide.')
    }
  }, [searchParams])

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Erreur lors de la mise à jour du mot de passe.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div>
      <h1>Réinitialisation du mot de passe</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Mettre à jour le mot de passe</button>
    </div>
  )
}
