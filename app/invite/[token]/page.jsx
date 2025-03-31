'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function InvitePage() {
  const { token } = useParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      const res = await fetch('/api/invitations/verify', {
        method: 'POST',
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      if (res.ok) {
        setEmail(data.email)
      } else {
        setError("Lien invalide ou expiré.")
      }
      setLoading(false)
    }
    verify()
  }, [token])

  const handleSubmit = async () => {
    const res = await fetch('/api/invitations/complete', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/login')
    } else {
      setError(data.error || 'Erreur')
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Créer votre mot de passe</h1>
      <p className="mb-2">Adresse invitée : {email}</p>
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">Créer mon compte</button>
    </div>
  )
}