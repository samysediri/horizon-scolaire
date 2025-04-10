'use server'

import { createServerClient as createSupabaseServerClient, type SupabaseClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient(): Promise<SupabaseClient> {
  const cookieStore = cookies()

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const value = cookieStore.get(name)?.value
          return value ?? null
        },
      },
    }
  )
}
