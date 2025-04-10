'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardRedirect() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = createPagesBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      console.log('USER:', user)

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

  if (loading) return <p>Chargement du tableau de bord...</p>
  if (error) return <p>{error}</p>

  return null
}

