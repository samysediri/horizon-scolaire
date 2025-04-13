// app/dashboard/admin/ajouter-tuteur/page.tsx
'use client'

import { useState } from 'react'

export default function AjouterTuteur() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setMessage('')

    if (!name || !email) {
      setMessage('Champs manquants')
      return
    }

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
        setMessage('Invitation envoyée avec succès!')
        setName('')
        setEmail('')
      }
    } catch (err) {
      console.error('Erreur réseau:', err)
      setMessage('Erreur réseau (réponse vide de Supabase)')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur le Dashboard</h1>
      <h2 className="text-xl mb-2">Ajouter un tuteur</h2>
      <p className="mb-4">✅ Vous êtes connecté en tant qu’<strong>admin</strong>.</p>

      {message && <p className="mb-4 text-red-500">{message}</p>}

      <div className="flex flex-col space-y-2 max-w-sm">
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
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Envoyer l’invitation
        </button>
      </div>
    </div>
  )
}
