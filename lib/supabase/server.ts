// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies as nextCookies } from 'next/headers'

export const createClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return nextCookies().get(name)?.value
        },
        set(name: string, value: string, options: any) {
          nextCookies().set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          nextCookies().delete({ name, ...options })
        },
      },
    }
  )
}
