'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

export default function ListeElevesTuteur() {
  const user = useUser()
  const [eleves, setEleves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEleves = async () => {
      if (!user) {
        console.log('[Client] Utilisateur pas encore chargé...')
        return
      }

      console.log('[Client] Utilisateur prêt. ID =', user.id)

      try {
        const res = await fetch(`/api/tuteurs/eleves?tuteur_id=${user.id}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
        console.log('[Client] Élèves reçus =', data)

        setEleves(data)
        setLoading(false)
      } catch (err: any) {
        console.error('[Client] Erreur fetchEleves:', err.message)
        setError('Erreur lors du chargement des élèves.')
        setLoading(false)
      }
    }

    fetchEleves()
  }, [user])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mes élèves</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {eleves.length === 0 && !loading && <p>Aucun élève trouvé.</p>}
      <ul className="space-y-2">
        {eleves.map((eleve) => (
          <li key={eleve.id} className="border p-2 rounded shadow">
            <strong>{eleve.prenom} {eleve.nom}</strong> – {eleve.email}
            {eleve.lien_lessonspace && (
              <div>
                <a href={eleve.lien_lessonspace} target="_blank" className="text-blue-600 underline">Espace Lessonspace</a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
