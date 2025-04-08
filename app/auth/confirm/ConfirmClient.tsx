"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function ConfirmClient() {
  const router = useRouter()
  const supabase = createClient()
  const [message, setMessage] = useState("Confirmation en cours...")

  useEffect(() => {
    const confirm = async () => {
      // Lire le token depuis le hash
      const hash = window.location.hash
      const accessTokenMatch = hash.match(/access_token=([^&]*)/)
      const token = accessTokenMatch?.[1]

      if (!token) {
        setMessage("Lien invalide.")
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(token)

      if (error) {
        console.error(error)
        setMessage("Erreur de connexion. Lien invalide ou expiré.")
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        const role = user?.user_metadata?.role

        if (role === "admin") router.push("/dashboard/admin")
        else if (role === "tuteur") router.push("/dashboard/tuteur")
        else if (role === "eleve") router.push("/dashboard/eleve")
        else router.push("/dashboard")
      }
    }

    confirm()
  }, [router, supabase])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Confirmation du compte</h1>
      <p>{message}</p>
    </div>
  )
}
