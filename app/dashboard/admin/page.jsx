// app/dashboard/admin/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

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

      if (profileError || !profile) {
        console.error('Erreur de récupération du rôle:', profileError)
        router.push('/login')
        return
      }

      setUser(user)
      setIsAdmin(profile.role === 'admin')
      setLoading(false)
    }

    fetchUser()
  }, [])

  if (loading) {
    return <p className="text-gray-500">Chargement de l'utilisateur...</p>
  }

  if (!isAdmin) {
    return <p className="text-red-500">Accès refusé. Vous devez être admin.</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p className="text-gray-700 mb-6">Bienvenue, {user.email}</p>
      <div className="grid gap-4">
        <Link href="/dashboard/admin/ajouter-tuteur" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Ajouter un tuteur</Link>
        <Link href="/dashboard/admin/ajouter-eleve" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">Ajouter un élève</Link>
        <Link href="/dashboard/admin/lier-tuteur-eleve" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded">Lier tuteur et élève</Link>
        <Link href="/dashboard/admin/utilisateurs" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded">Voir tous les utilisateurs</Link>
        <Link href="/dashboard/admin/liste-eleves" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">Liste des élèves</Link>
        <Link href="/dashboard/admin/liste-tuteurs" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded">Liste des tuteurs</Link>
        <Link href="/dashboard/admin/invitations" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded">Invitations envoyées</Link>
      </div>
    </div>
  )
}
