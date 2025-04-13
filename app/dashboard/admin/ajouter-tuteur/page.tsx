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
          role: 'tuteur', // Obligatoire pour l'API backend
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        setMessage(errorData?.error || 'Erreur inconnue')
        return
      }

      const result = await res.json()
      if (!result.user_id) {
        setMessage('Invitation envoyée, mais ID non retourné.')
        return
      }

      setMessage(`Invitation envoyée à ${email} (ID: ${result.user_id})`)
      setName('')
      setEmail('')
    } catch (err) {
      console.error('Erreur envoi:', err)
      setMessage('Erreur réseau (réponse vide)')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur le Dashboard</h1>
      <h2 className="text-xl mb-2">Ajouter un tuteur</h2>
      <p className="mb-4">✅ Vous êtes connecté en tant qu’<strong>admin</strong>.</p>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <input
        type="text"
        placeholder="Nom"
        className="w-full p-2 mb-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Courriel"
        className="w-full p-2 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Envoyer l’invitation
      </button>
    </div>
  )
}
