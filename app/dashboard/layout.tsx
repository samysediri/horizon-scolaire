// app/dashboard/layout.tsx
import '@/app/globals.css'
import type { ReactNode } from 'react'
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="p-8">
        <h2 className="text-xl text-red-500">Utilisateur non connecté</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {children}
    </div>
  )
}
