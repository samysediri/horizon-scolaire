'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { differenceInYears, parseISO } from 'date-fns'
import type { Database } from '@/lib/database.types'

export default function DashboardEleve() {
  const supabase = createClientComponentClient<Database>()
  const [user, setUser] = useState<any>(null)
  const [eleve, setEleve] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'eleve') {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: eleveData, error: eleveError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)
        .single()

      if (eleveError) {
        console.error("Erreur chargement fiche élève:", eleveError.message)
        return
      }

      setEleve(eleveData)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p>Chargement de l’utilisateur...</p>
  if (!eleve) return <p className="text-red-500">Aucune fiche élève trouvée.</p>

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
