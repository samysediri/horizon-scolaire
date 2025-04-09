'use client'

import { useEffect, useState } from 'react'

export default function AjouterEleve() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [parentId, setParentId] = useState('')
  const [parents, setParents] = useState<any[]>([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Va chercher les parents dans la table profiles
    const fetchParents = async () => {
      const res = await fetch('/api/parents') // on va faire ce endpoint ensuite
      const data = await res.json()
      setParents(data)
    }
    fetchParents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    // 1. Créer l'élève
    const res = await fetch('/api/invite-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom,
        email,
        role: 'eleve',
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erreur à la création de l’élève')
      return
    }

    const eleveId = data.user_id // on retournera ça dans l’API plus tard

    // 2. Créer la relation avec le parent
    const relationRes = await fetch('/api/lier-eleve-parent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eleve_id: eleveId,
        parent_id: parentId,
      }),
    })

    if (!relationRes.ok) {
      setError('Erreur lors du lien avec le parent.')
      return
    }

    setSuccess(true)
    setNom('')
    setEmail('')
    setParentId('')
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un élève</h1>

      {success && <p className="text-green-600 mb-4">Élève invité avec succès!</p>}
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
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sélectionner un parent</option>
          {parents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.nom} ({parent.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Inviter l’élève
        </button>
      </form>
    </div>
  )
}
