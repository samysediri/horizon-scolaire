'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { differenceInYears, parseISO } from 'date-fns'

export default function DashboardEleve() {
  const [eleve, setEleve] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEleve = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("❌ Impossible d'obtenir l'utilisateur :", userError)
        router.push('/login')
        return
      }

      console.log("🧠 ID utilisateur :", user.id)

      const { data, error } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)

      if (error) {
        console.error("❌ Erreur Supabase :", error)
        return
      }

      if (!data || data.length === 0) {
        console.warn("⚠️ Aucun élève trouvé avec cet ID :", user.id)
        return
      }

      setEleve(data[0])
      setLoading(false)
    }

    fetchEleve()
  }, [])

  if (loading) {
    return <p className="p-6 text-gray-600">Chargement de l’utilisateur...</p>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fiche de {eleve.prenom} {eleve.nom}</h1>
      <div className="space-y-2 text-gray-800">
        <p><strong>Courriel de l’élève :</strong> {eleve.email}</p>
        <p><strong>Courriel du parent :</strong> {eleve.parent_email}</p>
        <p><strong>Téléphone du parent :</strong> {eleve.parent_telephone}</p>
        <p><strong>Âge :</strong> {eleve.date_naissance
          ? differenceInYears(new Date(), parseISO(eleve.date_naissance)) + " ans"
          : "N/A"}</p>
        <p><strong>Besoins spécifiques :</strong></p>
        <p className="ml-4 text-gray-700 italic">
          {eleve.besoins || "Aucun besoin particulier spécifié."}
        </p>
      </div>
    </div>
  )
}
