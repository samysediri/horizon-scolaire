'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function AuthConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get('code')
      if (!code) return

      const supabase = createPagesBrowserClient()

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('Erreur d’échange de session :', error.message)
        return
      }

      // Récupération du profil après connexion
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile?.role) {
        return router.push('/login')
      }

      if (profile.role === 'admin') router.push('/dashboard/admin')
      else if (profile.role === 'tuteur') router.push('/dashboard/tuteur')
      else if (profile.role === 'eleve') router.push('/dashboard/eleve')
      else if (profile.role === 'parent') router.push('/dashboard/parent')
      else router.push('/login')
    }

    exchangeCode()
  }, [router, searchParams])

  return <p className="p-6 text-gray-500">Connexion en cours...</p>
}
