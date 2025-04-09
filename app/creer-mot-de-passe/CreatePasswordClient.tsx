'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function CreatePasswordClient() {
  const [supabase] = useState(() => createPagesBrowserClient())
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const restoreSession = async () => {
      const hash = window.location.hash
      if (!hash.includes('access_token')) {
        setErrorMsg('Lien invalide ou expiré.')
        return
      }

      const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
      if (error || !data.session) {
        setErrorMsg('Échec de la récupération de la session.')
        return
      }

      setSessionLoaded(true)
    }

    restoreSession()
  }, [supabase])

  const handleSubmit = async () => {
    setErrorMsg('')

    if (!password || password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setErrorMsg('Erreur : ' + error.message)
    } else {
      router.push('/dashboard') // ou n'importe quelle autre page après succès
    }
  }

  if (!sessionLoaded) return <p>Chargement de la session…</p>

  return (
    <div>
      <h1>Créer un mot de passe</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <label>Nouveau mot de passe</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <label>Confirmez le mot de passe</label>
      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <br />
      <button onClick={handleSubmit}>Créer le mot de passe</button>
    </div>
  )
}
