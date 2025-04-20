import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { seance_id } = body

    if (!seance_id) {
      return NextResponse.json({ error: 'ID de séance manquant' }, { status: 400 })
    }

    // Récupérer les infos de la séance
    const { data: seance, error: seanceError } = await supabase
      .from('seances')
      .select('id, duree_reelle, tuteur_id, eleve_id')
      .eq('id', seance_id)
      .single()

    if (seanceError || !seance) {
      return NextResponse.json({ error: 'Séance non trouvée' }, { status: 404 })
    }

    // Récupérer le tuteur (pour le taux horaire)
    const { data: tuteur } = await supabase
      .from('tuteurs')
      .select('taux_horaire')
      .eq('id', seance.tuteur_id)
      .single()

    if (!tuteur?.taux_horaire) {
      return NextResponse.json({ error: 'Taux horaire non trouvé pour le tuteur' }, { status: 404 })
    }

    // Récupérer l'élève et son parent
    const { data: eleve } = await supabase
      .from('eleves')
      .select('parent_id')
      .eq('id', seance.eleve_id)
      .single()

    if (!eleve?.parent_id) {
      return NextResponse.json({ error: 'Parent introuvable pour cet élève' }, { status: 404 })
    }

    const montant = (seance.duree_reelle / 60) * tuteur.taux_horaire
    const now = new Date()
    const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Vérifier s'il existe déjà une facture pour ce mois et ce parent
    const { data: factureExistante } = await supabase
      .from('factures')
      .select('*')
      .eq('parent_id', eleve.parent_id)
      .eq('mois', mois)
      .single()

    if (factureExistante) {
      const { error: updateError } = await supabase
        .from('factures')
        .update({ montant_total: factureExistante.montant_total + montant })
        .eq('id', factureExistante.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase.from('factures').insert({
        parent_id: eleve.parent_id,
        mois,
        annee: now.getFullYear(),
        montant_total: montant,
        payee: false,
        created_at: now.toISOString(),
      })

      if (insertError) throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[API] Erreur facture (brute) :', err)
    const message = typeof err?.message === 'string' ? err.message : JSON.stringify(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
