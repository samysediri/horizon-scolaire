// Fichier : app/dashboard/tuteur/eleves/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

export default function ListeElevesTuteur() {
  const user = useUser()
  const [eleves, setEleves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      console.log('[Client] Utilisateur pas encore chargé...')
      return
    }

    const fetchEleves = async () => {
      try {
        console.log('[Client] Utilisateur détecté :', user.id)
        const res = await fetch(`/api/tuteurs/eleves?tuteur_id=${user.id}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data?.error || 'Erreur inconnue')

        setEleves(data)
        console.log('[Client] Éleves reçus :', data)
      } catch (err: any) {
        console.error('[Client] Erreur fetchEleves :', err.message)
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
      {error && <p className="text-red-600">Erreur : {error}</p>}

      {eleves.length > 0 ? (
        <ul className="list-disc pl-6">
          {eleves.map((eleve) => (
            <li key={eleve.id}>
              {eleve.prenom} {eleve.nom} - {eleve.email}
            </li>
          ))}
        </ul>
      ) : !loading && <p>Aucun élève trouvé.</p>}
    </div>
  )
}
