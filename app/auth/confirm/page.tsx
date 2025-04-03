'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/auth/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        router.replace('/dashboard/admin')
      } else if (profile?.role === 'tuteur') {
        router.replace('/dashboard/tuteur')
      } else {
        router.replace('/dashboard/eleve')
      }
    }

    checkUser()
  }, [router, supabase])

  return <p>Redirection...</p>
}
