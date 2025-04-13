'use client'

import { useState } from 'react'

export default function AjouterTuteur() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email) {
      setMessage('Champs manquants')
      return
    }

    setIsLoading(true)
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
          role: 'tuteur',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data?.error || 'Erreur inconnue')
      } else {
        setMessage('Invitation envoyée avec succès !')
        setName('')
        setEmail('')
      }
    } catch (err) {
      console.error('Erreur réseau:', err)
      setMessage('Erreur réseau (réponse vide)')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur le Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Ajouter un tuteur</h2>
      <p className="mb-4">✅ Vous êtes connecté en tant qu’<strong>admin</strong>.</p>

      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="email"
        placeholder="Courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Envoi en cours...' : 'Envoyer l’invitation'}
      </button>
    </div>
  )
}
