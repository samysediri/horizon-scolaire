// ./lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

if (typeof window !== 'undefined') {
  alert('🔍 NEXT_PUBLIC_SUPABASE_URL: ' + process.env.NEXT_PUBLIC_SUPABASE_URL);
  alert('🔍 NEXT_PUBLIC_SUPABASE_ANON_KEY: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 
