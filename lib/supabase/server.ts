'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const supabase = createServerComponentClient({ cookies })
  return supabase
}
