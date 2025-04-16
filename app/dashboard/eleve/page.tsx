'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardEleve() {
  const [user, setUser] = useState(null)
  const [eleve, setEleve] = useState(null)
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState('Démarrage...')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      setDebug('Étape 1 : récupération utilisateur...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        setDebug(`Erreur utilisateur : ${userError?.message || 'non connecté'}`)
        router.push('/login')
        return
      }

      setDebug(`Étape 2 : utilisateur détecté : ${user.id}`)
      setUser(user)

      setDebug('Étape 3 : recherche dans la table "eleves"...')
      const { data: profil, error: profilError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profilError) {
        setDebug(`Erreur chargement élève : ${profilError.message}`)
        return
      }

      if (!profil) {
        setDebug(`Aucun élève trouvé avec cet ID : ${user.id}`)
        return
      }

      setDebug('Élève trouvé avec succès 🎉')
      setEleve(profil)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p>{debug}</p>
  if (!eleve) return <p>{debug}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue {eleve.prenom} {eleve.nom}</h1>
      <p className="mb-2">📧 {eleve.email}</p>
      <p className="mb-2">🎯 Lien Lessonspace : <a className="text-blue-600 underline" href={eleve.lien_lessonspace}>{eleve.lien_lessonspace}</a></p>
      <div className="mt-4 text-sm text-gray-500">✅ {debug}</div>
    </div>
  )
}
