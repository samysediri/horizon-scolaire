// app/dashboard/admin/lier-tuteur-eleve/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function LierTuteurElevePage() {
  const [eleves, setEleves] = useState<any[]>([])
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [eleveId, setEleveId] = useState('')
  const [tuteurId, setTuteurId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [elevesRes, tuteursRes] = await Promise.all([
          fetch('/api/eleves'),
          fetch('/api/tuteurs')
        ])

        const elevesData = await elevesRes.json()
        const tuteursData = await tuteursRes.json()

        if (elevesRes.ok) setEleves(elevesData)
        if (tuteursRes.ok) setTuteurs(tuteursData)
      } catch (err) {
        console.error('Erreur dans fetchData:', err)
        setMessage('Erreur lors du chargement des données')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('/api/lier-tuteur-eleve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eleve_id: eleveId, tuteur_id: tuteurId })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Tuteur lié à l’élève avec succès!')
        setEleveId('')
        setTuteurId('')
      } else {
        setMessage(data.error || 'Erreur lors de la liaison.')
      }
    } catch (err) {
      console.error('Erreur réseau:', err)
      setMessage('Erreur réseau.')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lier un tuteur à un élève</h1>

      {message && <p className="mb-4 text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={eleveId}
          onChange={(e) => setEleveId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sélectionner un élève</option>
          {eleves.map((eleve) => (
            <option key={eleve.id} value={eleve.id}>
              {eleve.nom} ({eleve.email})
            </option>
          ))}
        </select>

        <select
          value={tuteurId}
          onChange={(e) => setTuteurId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sélectionner un tuteur</option>
          {tuteurs.map((tuteur) => (
            <option key={tuteur.id} value={tuteur.id}>
              {tuteur.nom} ({tuteur.email})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lier tuteur ↔ élève
        </button>
      </form>
    </div>
  )
}
