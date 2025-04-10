import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ Pas besoin de passer de cookieStore
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const role = profile?.role

  if (error || !role) {
    console.error('Rôle introuvable pour cet utilisateur')
    redirect('/login')
  }

  // Si l'utilisateur tente d'accéder à /dashboard (racine), on le redirige vers son tableau de bord selon son rôle
  const pathname = new URL(process.env.NEXT_PUBLIC_SITE_URL || '').pathname
  if (pathname === '/dashboard') {
    redirect(`/dashboard/${role}`)
  }

  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
