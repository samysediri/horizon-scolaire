// ./lib/supabase/client.ts

'use client'

import { createPagesBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createPagesBrowserClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
};
