// app/dashboard/layout.tsx
import '@/app/globals.css'
import { createServerClient } from '@/lib/supabase/server'
import type { ReactNode } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase: SupabaseClient = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-gray-600 mb-2">
          Connecté en tant que : <strong>{user?.email}</strong>
        </p>
        <div className="bg-white rounded-xl shadow p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
