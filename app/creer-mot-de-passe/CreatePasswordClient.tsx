'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function CreatePasswordClient() {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const searchParams = useSearchParams()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [sessionRestored, setSessionRestored] = useState(false)

  useEffect(() => {
    const code = searchParams.get('access_token')
    if (!code) {
      setMessage('Lien invalide.')
      return
    }

    // Restaurer la session avant de pouvoir changer le mot de passe
    supabaseClient.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          console.error(error)
          setMessage('Erreur : lien invalide ou expiré.')
        } else {
          setSessionRestored(true)
        }
      })
  }, [supabaseClient, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.')
      return
    }

    const { error } = await supabaseClient.auth.updateUser({ password })
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Mot de passe créé avec succès. Redirection...')
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  if (!sessionRestored) {
    return <p>Chargement de la session...</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nouveau mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirme le mot de passe</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit">Créer mot de passe</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  )
}
