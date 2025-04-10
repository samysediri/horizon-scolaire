import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // On va chercher le rôle dans la table profiles
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (error || !profile?.role) {
    console.error('Aucun rôle trouvé, redirection vers login.')
    redirect('/login')
  }

  // Si l'utilisateur est à /dashboard, on redirige vers son dashboard spécifique
  const currentPath = cookieStore.get('next-url')?.value || ''
  const isAtRootDashboard = currentPath === '/dashboard'

  if (isAtRootDashboard) {
    redirect(`/dashboard/${profile.role}`)
  }

  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
