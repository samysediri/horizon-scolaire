'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

export async function addTuteur(formData: FormData) {
  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  const email = formData.get('email') as string;

  const supabase = createServerActionClient<Database>({ cookies });

  // Envoie le lien magique par courriel
  const { error: authError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'https://horizon-scolaire.vercel.app/auth/callback',
    },
  });

  if (authError) {
    console.error('Erreur d’envoi du lien magique:', authError.message);
    return;
  }

  // Ajoute les infos supplémentaires dans la table `profiles`
  const { error: insertError } = await supabase
    .from('profiles')
    .upsert({
      email,
      firstname,
      lastname,
      role: 'tuteur',
    });

  if (insertError) {
    console.error('Erreur lors de l’ajout du profil:', insertError.message);
    return;
  }

  // Revalide la page admin
  revalidatePath('/dashboard/admin');
}
