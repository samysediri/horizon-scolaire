// app/dashboard/layout.tsx

import { createClient } from '@/lib/supabase/server'
import SupabaseProvider from '@/components/SupabaseProvider'
import { cookies } from 'next/headers'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <SupabaseProvider session={session}>
      {children}
    </SupabaseProvider>
  )
}
