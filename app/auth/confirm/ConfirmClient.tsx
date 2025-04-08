"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ConfirmClient() {
  const router = useRouter()
  const [message, setMessage] = useState("Confirmation en cours...")

  useEffect(() => {
    const hash = window.location.hash
    const tokenMatch = hash.match(/access_token=([^&]*)/)
    const token = tokenMatch?.[1]

    if (!token) {
      setMessage("Lien invalide.")
      return
    }

    setMessage("Votre compte a été confirmé. Redirection...")

    setTimeout(() => {
      router.push("/dashboard") // tu peux changer vers /login ou / selon ton besoin
    }, 3000)
  }, [router])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Confirmation du compte</h1>
      <p>{message}</p>
    </div>
  )
}
