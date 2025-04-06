// app/inscription/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function InscriptionPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError("Veuillez vous connecter via le lien d'invitation.")
        setLoading(false)
        return
      }

      const { user } = session
      setEmail(user.email || '')
      setNom(user.user_metadata?.nom || '')
      setLoading(false)
    }

    fetchSession()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      setError("Session invalide.")
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { nom, role: 'tuteur' }
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSubmitted(true)
    router.push('/dashboard/tuteur')
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (submitted) return <p>Redirection vers votre tableau de bord...</p>

  return (
    <div>
      <h1>Inscription</h1>
      <p>Email : {email}</p>
      <input
        type="text"
        placeholder="Nom complet"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <button onClick={handleSubmit}>Compléter l'inscription</button>
    </div>
  )
}
