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
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error('Utilisateur non connecté')
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'eleve') {
        console.error('Accès refusé')
        router.push('/login')
        return
      }

      const { data: eleveData, error: eleveError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)
        .single()

      if (eleveError) {
        console.error('Erreur chargement élève:', eleveError.message)
        return
      }

      setEleve(eleveData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading || !eleve) return <p className="p-6 text-gray-500">Chargement...</p>

  const age = eleve.date_naissance
    ? differenceInYears(new Date(), parseISO(eleve.date_naissance))
    : 'N/A'

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Fiche de {eleve.prenom} {eleve.nom}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Se déconnecter
        </button>
      </div>
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
