'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { type SupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function SupabaseSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}
