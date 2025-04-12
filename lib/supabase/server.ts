// lib/supabase/server.ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  const cookieStore = cookies()

  return createPagesServerClient({
    cookies: () => cookieStore,
  })
}
