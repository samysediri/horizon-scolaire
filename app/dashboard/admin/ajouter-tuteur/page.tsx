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
          name: name.trim(),
          email: email.trim(),
          role: 'tuteur',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Erreur inconnue')
      } else {
        setMessage('Invitation envoyée avec succès!')
        setName('')
        setEmail('')
      }
    } catch (err) {
      console.error('Erreur réseau:', err)
      setMessage("Erreur réseau (réponse vide)")
    }
  }

  return (
    <div>
      <h1>Bienvenue sur le Dashboard</h1>
      <h2>Ajouter un tuteur</h2>
      <p>✅ Vous êtes connecté en tant qu’<strong>admin</strong>.</p>
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Envoyer l’invitation</button>
    </div>
  )
}
