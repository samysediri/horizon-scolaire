// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat personnalisée',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
