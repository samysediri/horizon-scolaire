'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()

  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        router.push('/login')
        return
      }

      const user = session.user

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.error('Erreur lors de la récupération du profil', profileError)
        setRole(null)
      } else {
        setRole(profile.role)
      }

      setLoading(false)
    }

    fetchRole()
  }, [supabase, router])

  if (loading) {
    return <p className="p-4">Chargement...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue dans votre tableau de bord</h1>

      {role ? (
        <p className="text-green-700 text-lg">
          ✅ Vous êtes connecté en tant que <strong>{role}</strong>.
        </p>
      ) : (
        <p className="text-red-600">❌ Impossible de déterminer votre rôle.</p>
      )}
    </div>
  )
}
