'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AjouterTuteur() {
  const supabase = createClient()
  const router = useRouter()

  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setAuthorized(false)
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || !profile || profile.role !== 'admin') {
        setAuthorized(false)
      } else {
        setAuthorized(true)
      }
    }

    checkAuth()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    const res = await fetch('/api/invite-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom,
        email,
        role: 'tuteur',
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess(true)
      setNom('')
      setEmail('')
    } else {
      setError(data.error || 'Erreur inconnue')
    }
  }

  if (authorized === null) return <p>Vérification en cours...</p>
  if (authorized === false) return <p>Utilisateur non autorisé</p>

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un tuteur</h1>

      {success && <p className="text-green-600 mb-4">Tuteur invité avec succès!</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom complet"
          className="w-full p-2 border rounded"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Adresse courriel"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Envoyer l’invitation
        </button>
      </form>
    </div>
  )
}
