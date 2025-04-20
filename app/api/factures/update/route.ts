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

    // Récupération des infos de la séance
    const { data: seance, error: seanceError } = await supabase
      .from('seances')
      .select('id, duree_reelle, tuteur_id, eleve_id')
      .eq('id', seance_id)
      .single()

    if (seanceError || !seance) {
      return NextResponse.json({ error: 'Séance non trouvée' }, { status: 404 })
    }

    // Récupération du taux horaire
    const { data: tuteur, error: tuteurError } = await supabase
      .from('tuteurs')
      .select('taux_horaire')
      .eq('id', seance.tuteur_id)
      .single()

    if (tuteurError || !tuteur?.taux_horaire) {
      return NextResponse.json({ error: 'Taux horaire introuvable' }, { status: 404 })
    }

    // Récupération du parent de l'élève
    const { data: eleve, error: eleveError } = await supabase
      .from('eleves')
      .select('parent_id')
      .eq('id', seance.eleve_id)
      .single()

    if (eleveError || !eleve?.parent_id) {
      return NextResponse.json({ error: 'Parent introuvable pour cet élève' }, { status: 404 })
    }

    const montant = (seance.duree_reelle / 60) * tuteur.taux_horaire
    const now = new Date()
    const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const annee = now.getFullYear()

    // Vérifier si une facture existe déjà
    const { data: factureExistante } = await supabase
      .from('factures')
      .select('*')
      .eq('parent_id', eleve.parent_id)
      .eq('mois', mois)
      .eq('annee', annee)
      .single()

    if (factureExistante) {
      const nouveauMontant = (factureExistante.montant_total || 0) + montant

      const { error: updateError } = await supabase
        .from('factures')
        .update({ montant_total: nouveauMontant })
        .eq('id', factureExistante.id)

      if (updateError) {
        console.error('[Factures] Erreur mise à jour :', updateError.message)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, updated: true })
    } else {
      const { error: insertError } = await supabase.from('factures').insert({
        parent_id: eleve.parent_id,
        mois,
        annee,
        montant_total: montant,
        payee: false,
        created_at: now.toISOString()
      })

      if (insertError) {
        console.error('[Factures] Erreur insertion :', insertError.message)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, created: true })
    }
  } catch (err: any) {
    console.error('[Factures] Erreur serveur :', err.message)
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}
