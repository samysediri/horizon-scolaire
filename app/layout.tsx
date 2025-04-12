// app/layout.tsx
import './globals.css'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { SupabaseProvider } from '@/components/supabase-provider'

export const metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat scolaire',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="fr">
      <body>
        <SupabaseProvider session={session}>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
