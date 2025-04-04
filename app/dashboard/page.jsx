'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function DashboardRedirect() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError('Utilisateur non authentifié')
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError || !profile) {
        setError('Profil introuvable')
        setLoading(false)
        return
      }

      const role = profile.role

      if (role === 'tuteur') router.push('/dashboard/tuteur')
      else if (role === 'eleve') router.push('/dashboard/eleve')
      else if (role === 'parent') router.push('/dashboard/parent')
      else if (role === 'admin') router.push('/dashboard/admin')
      else {
        setError(`Rôle inconnu : ${role}`)
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) return <p className="p-4">Chargement du tableau de bord...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  return null
}
