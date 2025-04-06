import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies() // <-- ici on attend la promesse

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set() {
          // Optionnel – seulement nécessaire si tu veux modifier les cookies côté serveur
        },
        remove() {
          // Optionnel aussi
        }
      }
    }
  )
}
