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
  const [roleMessage, setRoleMessage] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log('USER:', user)


      if (!user) {
        setAuthorized(false)
        setRoleMessage('Utilisateur non connecté')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        console.error('Erreur profil :', error)
console.log('ID user :', user.id)

        setAuthorized(false)
        setRoleMessage('Impossible de récupérer le profil utilisateur.')
        return
      }

      const role = profile.role

      if (role === 'admin') {
        setAuthorized(true)
        setRoleMessage('✅ Vous êtes connecté en tant qu’**admin**.')
      } else if (role === 'tuteur') {
        setAuthorized(false)
        setRoleMessage('❌ Accès refusé : vous êtes un **tuteur**.')
      } else if (role === 'eleve') {
        setAuthorized(false)
        setRoleMessage('❌ Accès refusé : vous êtes un **élève**.')
      } else {
        setAuthorized(false)
        setRoleMessage(`❌ Rôle inconnu : ${role}`)
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

  if (authorized === null) return <p>Chargement...</p>

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un tuteur</h1>

      <p className="mb-4 text-sm text-gray-700">{roleMessage}</p>

      {authorized && (
        <>
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
        </>
      )}
    </div>
  )
}
