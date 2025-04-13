'use client'

import { useEffect, useState } from 'react'

export default function LierTuteurEleve() {
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [eleves, setEleves] = useState<any[]>([])
  const [selectedTuteurId, setSelectedTuteurId] = useState('')
  const [selectedEleveId, setSelectedEleveId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const [tuteurRes, eleveRes] = await Promise.all([
          fetch('/api/tuteurs'),
          fetch('/api/eleves'),
        ])

        const tuteursData = await tuteurRes.json()
        const elevesData = await eleveRes.json()

        if (!tuteurRes.ok || !eleveRes.ok) throw new Error('Erreur de chargement')

        setTuteurs(tuteursData)
        setEleves(elevesData)
      } catch (error) {
        setMessage("Erreur lors du chargement des utilisateurs")
      }
    }

    fetchUtilisateurs()
  }, [])

  const handleLink = async () => {
    setMessage('')

    try {
      const res = await fetch('/api/lier-tuteur-eleve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tuteur_id: selectedTuteurId, eleve_id: selectedEleveId }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur de liaison')

      setMessage('Tuteur lié à l’élève avec succès!')
      setSelectedTuteurId('')
      setSelectedEleveId('')
    } catch (err: any) {
      setMessage(err.message || 'Erreur inconnue')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lier un tuteur à un élève</h1>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <div className="space-y-4">
        <select
          value={selectedTuteurId}
          onChange={(e) => setSelectedTuteurId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Sélectionner un tuteur</option>
          {tuteurs.map((tuteur) => (
            <option key={tuteur.id} value={tuteur.id}>
              {tuteur.nom} ({tuteur.email})
            </option>
          ))}
        </select>

        <select
          value={selectedEleveId}
          onChange={(e) => setSelectedEleveId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Sélectionner un élève</option>
          {eleves.map((eleve) => (
            <option key={eleve.id} value={eleve.id}>
              {eleve.nom} ({eleve.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleLink}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lier le tuteur à l’élève
        </button>
      </div>
    </div>
  )
}
