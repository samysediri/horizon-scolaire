'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function CreatePasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase] = useState(() => createPagesBrowserClient())
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession()
        if (error) {
          console.error(error)
          setErrorMsg('Erreur lors de l\'échange du code.')
        } else {
          router.push('/dashboard/tuteur')
        }
      } catch (err) {
        console.error(err)
        setErrorMsg('Une erreur est survenue lors de la connexion.')
      }
    }

    restoreSession()
  }, [supabase, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : (
        <p>Création du mot de passe en cours...</p>
      )}
    </div>
  )
}
