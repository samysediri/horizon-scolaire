// Fichier : app/api/tuteurs/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tuteurs')
      .select('id, profiles (nom, email)')

    if (error) {
      console.error('[API] Erreur récupération tuteurs:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const tuteurs = (data || []).map((tuteur: any) => ({
      id: tuteur.id,
      nom: tuteur.profiles?.nom || '',
      email: tuteur.profiles?.email || ''
    }))

    return NextResponse.json(tuteurs)
  } catch (err: any) {
    console.error('[API] Exception:', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
