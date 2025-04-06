import { createServerClient } from '@supabase/ssr'
import { cookies as getCookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await getCookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        // Supabase n’a pas toujours besoin de set/remove
        set: () => {},
        remove: () => {},
      },
    }
  )
}
