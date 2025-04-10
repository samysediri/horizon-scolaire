import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import SupabaseProvider from '@/components/SupabaseProvider'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import '../globals.css' // ✅ Corrigé : on monte d'un dossier

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="fr">
      <body>
        <SupabaseProvider session={session}>
          <Nav />
          <main>{children}</main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  )
}
