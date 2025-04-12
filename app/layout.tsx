// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat personnalisée',
}

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
