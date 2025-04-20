import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tuteur_id, eleve_id, date, heure, duree, eleve_nom, lien_tuteur, lien_eleve } = body

    if (!tuteur_id || !eleve_id || !date || !heure || !duree || !lien_tuteur || !lien_eleve) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = heure.split(':').map(Number)
    const localDate = new Date(Date.UTC(year, month - 1, day, hours + 4, minutes))

    const debut = localDate
    const fin = new Date(debut.getTime() + Number(duree) * 60000)

    const { error } = await supabase.from('seances').insert({
      tuteur_id,
      eleve_id,
      debut: debut.toISOString(),
      fin: fin.toISOString(),
      duree_minutes: Number(duree),
      eleve_nom,
      lien_tuteur,
      lien_eleve,
      duree_reelle: null,
      completee: false
    })

    if (error) {
      console.error('[API] Erreur insertion séance:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    const { error } = await supabase.from('seances').delete().eq('id', id)

    if (error) {
      console.error('[API] Erreur suppression séance:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, duree_reelle } = body

    if (!id || duree_reelle === undefined) {
      return NextResponse.json({ error: 'ID ou durée réelle manquante' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('seances')
      .update({ duree_reelle, completee: true })
      .eq('id', id)

    if (updateError) {
      console.error('[API] Erreur mise à jour durée réelle:', updateError.message)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://horizonscolaire.vercel.app'

    const factureRes = await fetch(`${baseUrl}/api/factures/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seance_id: id })
    })

    const raw = await factureRes.text()
    console.log('[API] Réponse brute facture:', raw)

    try {
      const json = JSON.parse(raw)
      if (!factureRes.ok) {
        return NextResponse.json({ error: json?.error || 'Erreur lors de la mise à jour de la facture' }, { status: 500 })
      }
    } catch (parseError: any) {
      console.error('[API] Erreur de parsing JSON:', parseError.message)
      return NextResponse.json({ error: 'Réponse JSON invalide de la facture' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur serveur : ' + err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tuteur_id = searchParams.get('tuteur_id')

  if (!tuteur_id) {
    return NextResponse.json({ error: 'Paramètre tuteur_id manquant' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('seances')
    .select('*')
    .eq('tuteur_id', tuteur_id)

  if (error) {
    console.error('[API] Erreur récupération séances:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
