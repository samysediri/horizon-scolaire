// app/auth/callback/route.ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Erreur récupération utilisateur:', userError)
    return redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Erreur récupération profil:', profileError)
    return redirect('/dashboard') // fallback générique
  }

  if (profile.role === 'admin') {
    return redirect('/dashboard/admin')
  }

  // Tu peux ajouter d'autres rôles ici si tu veux :
  if (profile.role === 'tuteur') {
    return redirect('/dashboard/tuteur')
  }

  return redirect('/dashboard')
}
