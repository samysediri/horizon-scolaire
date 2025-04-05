// ./lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

// Crée un client Supabase configuré avec les clés d'environnement
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
