// app/update-password/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpdatePassword = async () => {
    setError('')
    setMessage('')

    if (!password || !confirmPassword) {
      setError('Veuillez remplir les deux champs.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      setError('Erreur lors de la mise à jour du mot de passe.')
    } else {
      setMessage('Mot de passe mis à jour avec succès. Redirection en cours...')
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  return (
    <div>
      <h1>Réinitialisation du mot de passe</h1>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button onClick={handleUpdatePassword}>Mettre à jour le mot de passe</button>
    </div>
  )
}
