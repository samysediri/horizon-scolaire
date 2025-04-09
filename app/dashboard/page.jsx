import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return <p className="p-4 text-red-600">Utilisateur non authentifié</p>
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile) {
    return <p className="p-4 text-red-600">Profil introuvable</p>
  }

  const role = profile.role

  if (role === 'tuteur') redirect('/dashboard/tuteur')
  else if (role === 'eleve') redirect('/dashboard/eleve')
  else if (role === 'parent') redirect('/dashboard/parent')
  else if (role === 'admin') redirect('/dashboard/admin')
  else return <p className="p-4 text-red-600">Rôle inconnu : {role}</p>
}
