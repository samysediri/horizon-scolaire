'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'

export default function SupabaseProvider({ children, session }) {
  const [supabaseClient] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      {children}
    </SessionContextProvider>
  )
}
