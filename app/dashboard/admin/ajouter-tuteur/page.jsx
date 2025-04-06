// app/dashboard/admin/ajouter-tuteur/page.jsx

'use client'

import { useState } from 'react'

export default function AjouterTuteurPage() {
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setMessage('')
    setError('')
    setLoading(true)

    const res = await fetch('/api/invite-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, nom, role: 'tuteur' })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Erreur lors de l\'envoi de l\'invitation.')
    } else {
      setMessage("L'invitation a été envoyée avec succès !")
      setEmail('')
      setNom('')
    }
  }

  return (
    <div>
      <h1>Ajouter un tuteur</h1>
      <input
        type="text"
        placeholder="Nom du tuteur"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <input
        type="email"
        placeholder="Adresse courriel"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Envoi en cours...' : 'Envoyer une invitation'}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
