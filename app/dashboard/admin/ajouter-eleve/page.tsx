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
    const fetchParents = async () => {
      try {
        const res = await fetch('/api/parents')
        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || 'Erreur lors du chargement des parents')
        }

        setParents(Array.isArray(result) ? result : [])
      } catch (err: any) {
        console.error('Erreur dans fetchParents:', err)
        setError('Impossible de charger les parents. Veuillez réessayer plus tard.')
        setParents([])
      }
    }

    fetchParents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, role: 'eleve' }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur à la création de l’élève')

      const eleveId = data.user_id

      const relationRes = await fetch('/api/lier-eleve-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eleve_id: eleveId, parent_id: parentId }),
      })

      if (!relationRes.ok) throw new Error('Erreur lors du lien avec le parent.')

      setSuccess(true)
      setNom('')
      setEmail('')
      setParentId('')
    } catch (err: any) {
      console.error('Erreur dans handleSubmit:', err)
      setError(err.message || 'Une erreur est survenue.')
    }
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
          {Array.isArray(parents) && parents.map((parent) => (
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
