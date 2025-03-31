'use client'

import { useState } from 'react'

export default function InvitationsPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('parent')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleInvite = async () => {
    const res = await fetch('/api/invitations/create', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('Invitation envoyée!')
      setError('')
    } else {
      setMessage('')
      setError(data.error || "Erreur lors de l'envoi")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Envoyer une invitation</h1>
      <input
        type="email"
        placeholder="Courriel"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <select value={role} onChange={e => setRole(e.target.value)} className="w-full mb-3 p-2 border rounded">
        <option value="parent">Parent</option>
        <option value="eleve">Élève</option>
        <option value="tuteur">Tuteur</option>
      </select>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <button onClick={handleInvite} className="w-full bg-blue-600 text-white p-2 rounded">Envoyer</button>
    </div>
  )
}