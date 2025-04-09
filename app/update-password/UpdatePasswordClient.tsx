'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function UpdatePasswordClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const code = searchParams?.get('code') || ''

  useEffect(() => {
    if (!code) {
      setMessage('Lien invalide.')
    }
  }, [code])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.')
      return
    }

    const { error } = await supabaseClient.auth.exchangeCodeForSession(code)
    if (error) {
      setMessage('Lien expiré ou invalide.')
      return
    }

    const { error: updateError } = await supabaseClient.auth.updateUser({
      password,
    })

    if (updateError) {
      setMessage("Erreur lors de la mise à jour du mot de passe.")
    } else {
      setMessage("Mot de passe mis à jour avec succès ! Redirection...")
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmez le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Mettre à jour le mot de passe</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  )
}
