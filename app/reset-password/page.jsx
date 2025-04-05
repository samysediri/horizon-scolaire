'use client'

import { useState } from 'react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const res = await fetch('/api/reset-password/request', {
      method: 'POST',
      body: JSON.stringify({ email })
    })

    if (res.ok) {
      setMessage('Courriel de réinitialisation envoyé.')
    } else {
      setError("Impossible d'envoyer le courriel.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Mot de passe oublié</h1>
      <input
        type="email"
        placeholder="Votre courriel"
        className="w-full p-2 border rounded mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-2 rounded">
        Envoyer
      </button>
    </div>
  )
}