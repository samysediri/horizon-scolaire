import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { seance_id } = await req.json()

    if (!seance_id) {
      return NextResponse.json({ error: 'ID de séance manquant' }, { status: 400 })
    }

    const { data: seance, error: errSeance } = await supabase
      .from('seances')
      .select('duree_reelle, tuteur_id, eleve_id')
      .eq('id', seance_id)
      .single()

    if (errSeance || !seance) {
      return NextResponse.json({ error: 'Séance introuvable' }, { status: 404 })
    }

    const { data: tuteur } = await supabase
      .from('tuteurs')
      .select('taux_horaire')
      .eq('id', seance.tuteur_id)
      .single()

    const { data: eleve } = await supabase
      .from('eleves')
      .select('parent_id')
      .eq('id', seance.eleve_id)
      .single()

    if (!eleve?.parent_id || !tuteur?.taux_horaire) {
      return NextResponse.json({ error: 'Parent ou taux horaire manquant' }, { status: 400 })
    }

    const now = new Date()
    const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const montant = (seance.duree_reelle / 60) * tuteur.taux_horaire

    const { data: factureExistante } = await supabase
      .from('factures')
      .select('*')
      .eq('parent_id', eleve.parent_id)
      .eq('mois', mois)
      .single()

    if (factureExistante) {
      await supabase
        .from('factures')
        .update({ montant_total: factureExistante.montant_total + montant })
        .eq('id', factureExistante.id)
    } else {
      await supabase.from('factures').insert({
        parent_id: eleve.parent_id,
        mois,
        annee: now.getFullYear(),
        montant_total: montant,
        payee: false,
        created_at: now.toISOString()
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[API] Erreur update facture:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
