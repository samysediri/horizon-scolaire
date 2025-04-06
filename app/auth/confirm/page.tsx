// app/auth/confirm/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function AuthConfirmPage() {
  const router = useRouter()
  const supabase = createClient()
  const [message, setMessage] = useState("Confirmation en cours...")

  useEffect(() => {
    const confirm = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        setMessage("Erreur de connexion. Lien invalide ou expiré.")
        console.error(error)
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const role = user?.user_metadata?.role
        if (role === "admin") {
          router.push("/dashboard/admin")
        } else if (role === "tuteur") {
          router.push("/dashboard/tuteur")
        } else if (role === "eleve") {
          router.push("/dashboard/eleve")
        } else {
          router.push("/dashboard")
        }
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
