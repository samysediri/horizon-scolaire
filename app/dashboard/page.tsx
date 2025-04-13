'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export default function DashboardRedirectPage() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      console.log("SESSION DANS /dashboard :", session)

      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      console.log("PROFILE:", profile)

      if (profile?.role === 'admin') router.push('/dashboard/admin')
      else if (profile?.role === 'tuteur') router.push('/dashboard/tuteur')
      else if (profile?.role === 'parent') router.push('/dashboard/parent')
      else router.push('/login')

      setLoading(false)
    }

    checkSession()
  }, [])

  return <p className="text-gray-500">{loading ? 'Chargement...' : 'Redirection...'}</p>
}
