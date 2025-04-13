'use client'

import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TuteurDashboard() {
  const user = useUser()
  const [ready, setReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

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

  if (!ready) return null

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bienvenue sur le tableau de bord Tuteur</h1>

      <div className="space-y-3">
        <Link
          href="/dashboard/tuteur/eleves"
          className="block text-blue-600 hover:underline"
        >
          📚 Voir mes élèves
        </Link>

        <Link
          href="/dashboard/tuteur/horaire"
          className="block text-blue-600 hover:underline"
        >
          🗓️ Voir mon horaire
        </Link>

        <Link
          href="/dashboard/tuteur/heures"
          className="block text-blue-600 hover:underline"
        >
          ⏱️ Voir mes heures complétées
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className="block text-green-600 hover:underline mt-4"
          >
            🔐 Accéder au tableau de bord Admin
          </Link>
        )}
      </div>
    </div>
  )
}
