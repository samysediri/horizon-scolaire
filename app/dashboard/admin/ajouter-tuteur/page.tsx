// app/dashboard/admin/ajouter-tuteur/page.tsx
'use client'

import { useState } from 'react'

export default function AjouterTuteur() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email) {
      setMessage('Champs manquants')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          role: 'tuteur', // <- rôle explicitement défini ici
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data?.error || 'Une erreur est survenue')
      } else {
        setMessage('✅ Invitation envoyée avec succès')
        setName('')
        setEmail('')
      }
    } catch (error) {
      console.error('Erreur réseau:', error)
      setMessage('Erreur réseau (réponse vide)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur le Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Ajouter un tuteur</h2>
      <p className="mb-4">✅ Vous êtes connecté en tant qu’<strong>admin</strong>.</p>

      {message && (
        <p className={`mb-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Courriel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer l’invitation'}
        </button>
      </div>
    </div>
  )
}
