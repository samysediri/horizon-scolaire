// app/dashboard/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardRedirectPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function redirectUser() {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("Utilisateur non connecté", error)
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        console.error("Profil non trouvé", profileError)
        router.push('/login')
        return
      }

      if (profile.role === 'admin') {
        router.push('/dashboard/admin')
      } else if (profile.role === 'tuteur') {
        router.push('/dashboard/tuteur')
      } else if (profile.role === 'parent') {
        router.push('/dashboard/parent')
      } else {
        router.push('/login')
      }
    }

    redirectUser()
  }, [])

  return <p className="text-gray-500">Redirection en cours...</p>
}
