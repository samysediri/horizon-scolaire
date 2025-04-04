'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ConfirmPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const fullUrl = window.location.href
      const { error } = await supabase.auth.exchangeCodeForSession(fullUrl)

      if (error) {
        console.error('Erreur de session:', error.message)
        setError('Erreur de session : lien invalide ou expiré.')
      }

      setLoading(false)
    }

    // Attendre un peu pour s'assurer que window.location.href contient le hash
    setTimeout(run, 100)
  }, [supabase])

  if (loading) return <p>Chargement...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h1>Compte confirmé</h1>
      <p>Tu peux maintenant accéder à ton espace.</p>
      <button onClick={() => router.push('/dashboard/tuteur')}>Aller à mon tableau de bord</button>
    </div>
  )
}
