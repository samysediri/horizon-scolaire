// lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient as createSupabaseClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

export function createServerClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies
    }
  )
}
