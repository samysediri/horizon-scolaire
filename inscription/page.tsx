// app/inscription/page.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function InscriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=signup')) {
      const access_token = new URLSearchParams(hash.substring(1)).get('access_token')
      const refresh_token = new URLSearchParams(hash.substring(1)).get('refresh_token')
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token })
      }
    }
  }, [supabase])

  const handleSubmit = async () => {
    setError('')
    setMessage('')
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Mot de passe mis à jour avec succès!')
      router.push('/dashboard/tuteur')
    }
  }

  return (
    <div>
      <h1>Créer un mot de passe</h1>
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Mise à jour...' : 'Confirmer'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  )
}
