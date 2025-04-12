'use client'

import { useEffect, useState } from 'react'

export default function LierTuteurEleve() {
  const [tuteurs, setTuteurs] = useState<any[]>([])
  const [eleves, setEleves] = useState<any[]>([])
  const [selectedTuteur, setSelectedTuteur] = useState('')
  const [selectedEleves, setSelectedEleves] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const resTuteurs = await fetch('/api/tuteurs')
      const resEleves = await fetch('/api/eleves')
      const dataTuteurs = await resTuteurs.json()
      const dataEleves = await resEleves.json()
      setTuteurs(dataTuteurs)
      setEleves(dataEleves)
    }

    fetchData()
  }, [])

  const toggleEleve = (id: string) => {
    setSelectedEleves(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    if (!selectedTuteur || selectedEleves.length === 0) {
      setError("Veuillez choisir un tuteur et au moins un élève.")
      return
    }

    try {
      for (const eleveId of selectedEleves) {
        await fetch('/api/lier-tuteur-eleve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tuteur_id: selectedTuteur,
            eleve_id: eleveId,
          }),
        })
      }
      setSuccess(true)
      setSelectedTuteur('')
      setSelectedEleves([])
    } catch (err) {
      setError("Erreur lors de l'association.")
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lier un tuteur à des élèves</h1>

      {success && <p className="text-green-600 mb-4">Lien(s) créé(s) avec succès!</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Tuteur</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedTuteur}
            onChange={(e) => setSelectedTuteur(e.target.value)}
            required
          >
            <option value="">Sélectionner un tuteur</option>
            {tuteurs.map((tuteur) => (
              <option key={tuteur.id} value={tuteur.id}>
                {tuteur.nom} ({tuteur.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Élèves</label>
          <div className="max-h-60 overflow-y-auto border p-2 rounded space-y-1">
            {eleves.map((eleve) => (
              <label key={eleve.id} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedEleves.includes(eleve.id)}
                  onChange={() => toggleEleve(eleve.id)}
                />
                {eleve.nom} ({eleve.email})
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Créer les liens
        </button>
      </form>
    </div>
  )
}
