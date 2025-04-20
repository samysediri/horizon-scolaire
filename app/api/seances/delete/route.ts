import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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

    // Récupérer la séance avant de la supprimer
    const { data: seance, error: seanceError } = await supabase
      .from('seances')
      .select('id, duree_reelle, tuteur_id, eleve_id, facturee')
      .eq('id', seance_id)
      .single()

    if (seanceError || !seance) {
      return NextResponse.json({ error: 'Séance non trouvée' }, { status: 404 })
    }

    // Si elle n’était pas facturée, on la supprime simplement
    if (!seance.facturee) {
      await supabase.from('seances').delete().eq('id', seance_id)
      return NextResponse.json({ success: true, message: 'Séance supprimée sans impact' })
    }

    // Sinon, on doit mettre à jour la facture
    const { data: tuteur } = await supabase
      .from('tuteurs')
      .select('taux_horaire')
      .eq('id', seance.tuteur_id)
      .single()

    if (!tuteur?.taux_horaire) {
      return NextResponse.json({ error: 'Taux horaire non trouvé' }, { status: 404 })
    }

    const { data: parentLink } = await supabase
      .from('eleves_parents')
      .select('parent_id')
      .eq('eleve_id', seance.eleve_id)
      .single()

    if (!parentLink?.parent_id) {
      return NextResponse.json({ error: 'Parent introuvable' }, { status: 404 })
    }

    const montant = (seance.duree_reelle / 60) * tuteur.taux_horaire
    const now = new Date()
    const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const { data: facture } = await supabase
      .from('factures')
      .select('*')
      .eq('parent_id', parentLink.parent_id)
      .eq('mois', mois)
      .single()

    if (!facture) {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })
    }

    const nouveauMontant = facture.montant_total - montant

    if (nouveauMontant <= 0) {
      await supabase.from('factures').delete().eq('id', facture.id)
    } else {
      await supabase
        .from('factures')
        .update({ montant_total: nouveauMontant })
        .eq('id', facture.id)
    }

    // Supprimer la séance
    await supabase.from('seances').delete().eq('id', seance_id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[API] Erreur suppression facture liée à la séance :', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
