'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function CreatePasswordClient() {
  const [supabase] = useState(() => createPagesBrowserClient())
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession({})

        if (error) {
          console.error(error)
          setErrorMsg('Erreur lors de l\'échange du code.')
          return
        }
        setSessionLoaded(true)
      } catch (err) {
        console.error(err)
        setErrorMsg('Erreur inattendue.')
      }
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
      router.push('/dashboard') // tu peux rediriger ailleurs
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
