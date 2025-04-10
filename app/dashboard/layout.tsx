import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import SupabaseProvider from '@/components/SupabaseProvider'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createClient()


  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <SupabaseProvider session={session}>
      {children}
    </SupabaseProvider>
  )
}
