'use client'

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TuteurDashboard() {
  const user = useUser()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [salaire, setSalaire] = useState<number | null>(null)
  const [nomComplet, setNomComplet] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (user?.user_metadata?.role === 'admin') {
      setIsAdmin(true)
    }
  }, [user])

  useEffect(() => {
    const fetchInfosTuteur = async () => {
      if (!user?.id) return

      const now = new Date()
      const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      const { data: seances } = await supabase
        .from('seances')
        .select('duree_reelle, completee')
        .eq('tuteur_id', user.id)
        .eq('completee', true)

      const { data: tuteur } = await supabase
        .from('tuteurs')
        .select('taux_horaire, prenom, nom')
        .eq('id', user.id)
        .single()

      if (!seances || !tuteur?.taux_horaire) return

      const totalMinutes = seances.reduce((acc, s) => acc + (s.duree_reelle || 0), 0)
      const salaireEstime = (totalMinutes / 60) * tuteur.taux_horaire

      setSalaire(salaireEstime)
      setNomComplet(`${tuteur.prenom || ''} ${tuteur.nom || ''}`.trim())
    }

    fetchInfosTuteur()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!ready) return null

  const moisTexte = new Date().toLocaleDateString('fr-CA', { month: 'long' })

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bienvenue{nomComplet ? `, ${nomComplet}` : ''} !
            </h1>
            <p className="text-gray-500 text-sm">Tableau de bord Tuteur</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Déconnexion
          </button>
        </div>

        {salaire !== null && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded text-sm">
            💰 Solde du mois de <strong>{moisTexte}</strong> :{' '}
            <span className="text-black font-bold">{salaire.toFixed(2)} $</span>
          </div>
        )}

        <div className="flex flex-col space-y-3 text-sm">
          <Link
            href="/dashboard/tuteur/eleves"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center shadow"
          >
            📚 Voir mes élèves
          </Link>
          <Link
            href="/dashboard/tuteur/horaire"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-center shadow"
          >
            🗓️ Voir mon horaire
          </Link>
          <Link
            href="/dashboard/tuteur/heures"
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded text-center shadow"
          >
            ⏱️ Voir mes heures complétées
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded text-center shadow mt-2"
            >
              🔐 Accéder au tableau de bord Admin
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
