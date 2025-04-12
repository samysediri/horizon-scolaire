// lib/supabase/server.ts
'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  return createServerComponentClient({
    cookies,
  })
}
