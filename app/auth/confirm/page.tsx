'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session } from '@supabase/supabase-js'

export default function ConfirmPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [session, setSession] = useState<Session | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
  }, [supabase])

  const handleSetPassword = async () => {
    setError(null)
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Optionnel : tu peux fetcher le profil ici et router vers le bon dashboard
      router.push('/dashboard/tuteur') // adapte selon ton routing
    }
  }

  if (loading) return <p>Chargement...</p>

  if (!session) {
    return <p>Session invalide ou expirée. Essaie de recliquer sur le lien d’invitation.</p>
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h1>Bienvenue sur Horizon Scolaire</h1>
      <p>Merci d’avoir accepté l’invitation. Choisis un mot de passe pour activer ton compte.</p>

      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginTop: '1rem' }}
      />

      <button
        onClick={handleSetPassword}
        style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
      >
        Enregistrer mon mot de passe
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}
