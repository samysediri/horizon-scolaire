'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardEleve() {
  const [user, setUser] = useState(null)
  const [eleve, setEleve] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchEleve() {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("Erreur utilisateur:", error)
        router.push('/login')
        return
      }

      setUser(user)

      const { data, error: eleveError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)  // IMPORTANT : on cherche par l'ID du profil Supabase
        .maybeSingle()

      if (eleveError) {
        console.error('Erreur chargement fiche élève:', eleveError)
        return
      }

      if (!data) {
        console.warn('Aucun élève trouvé avec cet ID :', user.id)
      }

      setEleve(data)
      setLoading(false)
    }

    fetchEleve()
  }, [])

  if (loading) {
    return <p>Chargement de l’utilisateur...</p>
  }

  if (!eleve) {
    return <p className="text-red-500">Aucun profil élève trouvé pour cet utilisateur.</p>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bienvenue, {eleve.prenom} {eleve.nom}</h2>
      <p>Email: {eleve.email}</p>
      <p>Lien Lessonspace: <a href={eleve.lien_lessonspace} className="text-blue-600 underline">{eleve.lien_lessonspace}</a></p>
    </div>
  )
}
