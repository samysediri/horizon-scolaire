'use client'

import { useEffect, useState } from 'react'

export default function LierTuteurEleve() {
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [eleves, setEleves] = useState<any[]>([])
  const [tuteurId, setTuteurId] = useState('')
  const [eleveId, setEleveId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tuteursRes, elevesRes] = await Promise.all([
          fetch('/api/tuteurs'),
          fetch('/api/eleves'),
        ])

        const tuteursData = await tuteursRes.json()
        const elevesData = await elevesRes.json()

        setTuteurs(Array.isArray(tuteursData) ? tuteursData : [])
        setEleves(Array.isArray(elevesData) ? elevesData : [])
      } catch (err) {
        console.error('Erreur chargement:', err)
        setMessage('Erreur lors du chargement des données.')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!tuteurId || !eleveId) {
      setMessage('Veuillez sélectionner un tuteur et un élève.')
      return
    }

    const res = await fetch('/api/lier-tuteur-eleve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tuteur_id: tuteurId, eleve_id: eleveId }),
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(data.error || 'Erreur lors de la liaison')
    } else {
      setMessage('Liaison effectuée avec succès!')
      setTuteurId('')
      setEleveId('')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lier un tuteur à un élève</h1>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={tuteurId}
          onChange={(e) => setTuteurId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Sélectionner un tuteur</option>
          {tuteurs.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nom} ({t.email})
            </option>
          ))}
        </select>

        <select
          value={eleveId}
          onChange={(e) => setEleveId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Sélectionner un élève</option>
          {eleves.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom} ({e.email})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Lier
        </button>
      </form>
    </div>
  )
}

