// app/dashboard/admin/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      {user ? (
        <p className="text-gray-700">Bienvenue, {user.email}</p>
      ) : (
        <p className="text-gray-500">Chargement de l'utilisateur...</p>
      )}
    </div>
  )
}
