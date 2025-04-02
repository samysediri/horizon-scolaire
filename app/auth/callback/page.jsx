'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../../../utils/supabase'


export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data?.session) {
        router.push('/dashboard') // ou '/dashboard/tuteur' selon le rôle
      } else {
        router.push('/login') // ou une page d’erreur
      }
    }

    handleAuthRedirect()
  }, [router])

  return <p>Connexion en cours...</p>
}
