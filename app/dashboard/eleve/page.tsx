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
    const fetchData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.warn('Utilisateur non connecté')
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profil, error: profilError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profilError) {
        console.error('Erreur chargement fiche élève:', profilError.message)
        return
      }

      if (!profil) {
        console.warn('Aucun profil élève trouvé pour cet utilisateur.')
        return
      }

      setEleve(profil)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p>Chargement de l’utilisateur...</p>
  if (!eleve) return <p>Aucun profil élève trouvé pour cet utilisateur.</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue {eleve.prenom} {eleve.nom}</h1>
      <p className="mb-2">📧 {eleve.email}</p>
      <p className="mb-2">🎯 Lien Lessonspace : <a className="text-blue-600 underline" href={eleve.lien_lessonspace}>{eleve.lien_lessonspace}</a></p>
    </div>
  )
}
