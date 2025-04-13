// app/dashboard/tuteur/eleves/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

export default function ListeElevesTuteur() {
  const user = useUser()
  const [eleves, setEleves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchEleves = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/tuteurs/eleves?tuteur_id=${user.id}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Erreur de chargement')

        setEleves(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEleves()
  }, [user])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mes élèves</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {eleves.length === 0 && !loading && <p>Aucun élève associé.</p>}

      <ul className="space-y-2">
        {eleves.map((eleve) => (
          <li key={eleve.id} className="p-4 border rounded">
            <strong>{eleve.nom}</strong> — {eleve.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
