'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <UpdatePasswordClient />
    </Suspense>
  )
}

function UpdatePasswordClient() {
  const supabase = createPagesBrowserClient()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Mise à jour du mot de passe...')

  useEffect(() => {
    const updatePassword = async () => {
      const accessToken = searchParams.get('access_token')
      if (!accessToken) {
        setMessage("Lien invalide.")
        return
      }

      const { data, error } = await supabase.auth.getUser(accessToken)
      if (error || !data?.user) {
        setMessage("Lien expiré ou utilisateur introuvable.")
        return
      }

      // Redirection vers une interface de création de mot de passe personnalisée ?
      // Ou juste un message de confirmation ?
      setMessage("Utilisateur authentifié. Vous pouvez maintenant définir un nouveau mot de passe.")
    }

    updatePassword()
  }, [searchParams, supabase])

  return <p>{message}</p>
}
