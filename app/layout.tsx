import './globals.css'
import { Inter } from 'next/font/google'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { SupabaseProvider } from './supabase-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat personnalisée',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="fr">
      <body className={inter.className}>
        <SupabaseProvider session={session}>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
