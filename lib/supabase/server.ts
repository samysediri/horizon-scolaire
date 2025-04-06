import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          // Cette méthode est facultative selon ton usage
          // Supabase ne requiert pas toujours "set"
        },
        remove: (name: string) => {
          // Facultatif aussi
        },
      },
    }
  )
}
