'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session } from '@supabase/supabase-js'

export default function ConfirmClient() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [session, setSession] = useState<Session | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (exchangeError) {
        setError('Session invalide ou expirée. Essaie de recliquer sur le lien d’invitation.')
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    init()
  }, [])

  const handleSetPassword = async () => {
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard/tuteur')
    }
  }

  if (loading) return <p>Chargement...</p>

  if (!session) return <p>Session invalide ou expirée.</p>

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h1>Bienvenue sur Horizon Scolaire</h1>
      <p>Choisis un mot de passe pour activer ton compte.</p>

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginTop: '1rem' }}
      />
      <button onClick={handleSetPassword} style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}>
        Enregistrer
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}
