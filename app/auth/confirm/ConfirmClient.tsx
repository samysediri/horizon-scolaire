"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

function InnerConfirm() {
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Confirmation en cours...")

  useEffect(() => {
    const confirm = async () => {
      const code = searchParams.get("token") || searchParams.get("code")

      if (!code) {
        setMessage("Lien invalide.")
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

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
  }, [searchParams, router, supabase])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Confirmation du compte</h1>
      <p>{message}</p>
    </div>
  )
}

export default function ConfirmClient() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <InnerConfirm />
    </Suspense>
  )
}
