'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { differenceInYears, parseISO } from 'date-fns'

export default function DashboardEleve() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEleve, setIsEleve] = useState(false)
  const [eleveData, setEleveData] = useState(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("Erreur de récupération de l'utilisateur:", error)
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile || profile.role !== 'eleve') {
        console.error('Accès refusé (rôle invalide)', profileError)
        router.push('/login')
        return
      }

      // ✅ L'utilisateur est un élève — on charge sa fiche
      const { data: eleve, error: eleveError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)
        .single()

      if (eleveError || !eleve) {
        console.error('Erreur chargement fiche élève:', eleveError)
        router.push('/login')
        return
      }

      setUser(user)
      setIsEleve(true)
      setEleveData(eleve)
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p className="text-gray-500 p-6">Chargement de l’utilisateur...</p>
  if (!isEleve) return <p className="text-red-500 p-6">Accès refusé. Vous devez être élève.</p>

  const age = eleveData.date_naissance
    ? differenceInYears(new Date(), parseISO(eleveData.date_naissance))
    : 'N/A'

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fiche Élève</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Se déconnecter
        </button>
      </div>

      <div className="space-y-2 text-gray-800">
        <p><strong>Nom :</strong> {eleveData.prenom} {eleveData.nom}</p>
        <p><strong>Courriel :</strong> {eleveData.email}</p>
        <p><strong>Âge :</strong> {age} ans</p>
        <p><strong>Courriel du parent :</strong> {eleveData.parent_email}</p>
        <p><strong>Téléphone du parent :</strong> {eleveData.parent_telephone}</p>
        <p><strong>Besoins :</strong> <span className="italic">{eleveData.besoins || 'Aucun'}</span></p>
      </div>
    </div>
  )
}
