// app/layout.tsx
'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

export const metadata = {
  title: 'Horizon Scolaire',
  description: 'Plateforme de tutorat en ligne',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  )
}
