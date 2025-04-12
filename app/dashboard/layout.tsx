import '@/app/globals.css'
import { createServerClient } from '@/lib/supabase/server'
import type { ReactNode } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerClient() as SupabaseClient
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <html lang="fr">
      <body>
        {session ? (
          <div>
            <h1>Bienvenue sur le Dashboard</h1>
            {children}
          </div>
        ) : (
          <div>Utilisateur non authentifié</div>
        )}
      </body>
    </html>
  )
}
