// app/dashboard/admin/page.tsx

import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = createServerClient(cookies())

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return redirect('/dashboard')
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Bienvenue sur le Dashboard</h1>
      <h2>Tableau de bord Admin</h2>

      <p style={{ marginTop: '1rem', fontWeight: 'bold', color: 'green' }}>
        ✅ Vous êtes connecté en tant qu’<strong>admin</strong>.
      </p>

      <ul style={{ marginTop: '2rem', lineHeight: '2rem' }}>
        <li>
          <Link href="/dashboard/admin/ajouter-tuteur">➕ Ajouter un tuteur</Link>
        </li>
        <li>
          <Link href="/dashboard/admin/ajouter-eleve">➕ Ajouter un élève</Link>
        </li>
        <li>
          <Link href="/dashboard/admin/lier-tuteur-eleve">🔗 Lier un tuteur ↔ élève</Link>
        </li>
        <li>
          <Link href="/dashboard/admin/utilisateurs">👥 Gérer les utilisateurs</Link>
        </li>
      </ul>
    </main>
  )
}
