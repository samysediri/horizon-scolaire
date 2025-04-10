'use server'

import { createServerClient as createSupabaseClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function createServerClient(): Promise<SupabaseClient> {
  const cookieStore = cookies()

  return createSupabaseClient(
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
