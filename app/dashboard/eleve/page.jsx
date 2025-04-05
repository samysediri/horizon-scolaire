'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { differenceInYears, parseISO } from 'date-fns'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function FicheEleve() {
  const { id } = useParams()
  const [eleve, setEleve] = useState(null)

  useEffect(() => {
    const fetchEleve = async () => {
      const { data, error } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        console.error('Erreur lors du chargement de la fiche élève:', error.message)
        return
      }

      setEleve(data)
    }

    if (id) fetchEleve()
  }, [id])

  if (!eleve) return <p className="p-6 text-gray-600">Chargement de la fiche élève...</p>

  const age = eleve.date_naissance
    ? differenceInYears(new Date(), parseISO(eleve.date_naissance))
    : 'N/A'

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Fiche de {eleve.prenom} {eleve.nom}</h2>
      <div className="space-y-2 text-gray-800">
        <p><strong>Courriel de l’élève :</strong> {eleve.email}</p>
        <p><strong>Courriel du parent :</strong> {eleve.parent_email}</p>
        <p><strong>Téléphone du parent :</strong> {eleve.parent_telephone}</p>
        <p><strong>Âge de l’élève :</strong> {age} ans</p>
        <p><strong>Besoins spécifiques :</strong></p>
        <p className="ml-4 text-gray-700 italic">{eleve.besoins || 'Aucun besoin particulier spécifié.'}</p>
      </div>
    </div>
  )
}

