'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function UpdatePassword() {
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const searchParams = useSearchParams()
  const access_token = searchParams.get('access_token')
  const supabase = createPagesBrowserClient()

  const handleUpdate = async () => {
    if (password !== confirmPassword) return setError('Les mots de passe ne correspondent pas.')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) return setError('Erreur : ' + error.message)

    window.location.href = '/dashboard'
  }

  return (
    <div>
      <h1>Réinitialisation du mot de passe</h1>
      <input type='password' placeholder='Nouveau mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type='password' placeholder='Confirmer' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button onClick={handleUpdate}>Mettre à jour</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
