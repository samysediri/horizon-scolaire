'use client'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { type SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const createBrowserClient = (): SupabaseClient<Database> =>
  createBrowserSupabaseClient<Database>()
