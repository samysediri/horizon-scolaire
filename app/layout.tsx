import './globals.css'
import SupabaseSessionProvider from '@/components/SessionProvider'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat en ligne',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SupabaseSessionProvider>
          {children}
        </SupabaseSessionProvider>
      </body>
    </html>
  )
}
