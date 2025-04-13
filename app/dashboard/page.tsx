// app/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export default function DashboardRedirectPage() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function redirectUser() {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      console.log("USER FETCHED:", user)

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

      console.log("PROFILE FETCHED:", profile)

      if (profileError || !profile) {
        console.error("Profil non trouvé", profileError)
        router.push('/login')
        return
      }

      console.log("Redirection vers:", profile.role)

      switch (profile.role) {
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'tuteur':
          router.push('/dashboard/tuteur')
          break
        case 'parent':
          router.push('/dashboard/parent')
          break
        default:
          router.push('/login')
      }
    }

    redirectUser()
  }, [])

  return <p className="text-gray-500">Redirection en cours...</p>
}
