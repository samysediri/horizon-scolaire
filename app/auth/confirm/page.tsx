import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || error) {
    return redirect('/login');
  }

  if (profile.role === 'admin') {
    return redirect('/dashboard/admin');
  }

  if (profile.role === 'tuteur') {
    return redirect('/dashboard/tuteur');
  }

  if (profile.role === 'eleve') {
    return redirect('/dashboard/eleve');
  }

  if (profile.role === 'parent') {
    return redirect('/dashboard/parent');
  }

  return redirect('/login');
}
