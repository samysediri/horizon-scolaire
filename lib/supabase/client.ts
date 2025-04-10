// Fichier: lib/supabase/client.ts (ou createBrowserClient.ts)

import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        const value = document.cookie
          .split('; ')
          .find((cookie) => cookie.startsWith(`${name}=`))
          ?.split('=')[1]

        // CORRECTION : on retourne simplement la valeur brute
        return value ?? null
      },
    },
  }
)
