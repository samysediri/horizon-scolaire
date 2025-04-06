// lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies() // ✅ PAS async

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // Optionnel – nécessaire seulement si tu modifies les cookies
        },
        remove() {
          // Optionnel – nécessaire seulement si tu supprimes les cookies
        },
      },
    }
  )
}
