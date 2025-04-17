import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.LESSONSPACE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Clé API Lessonspace manquante' }, { status: 500 });
  }

  const response = await fetch('https://api.thelessonspace.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Séance Horizon Scolaire',
      reusable: true, // ✅ permet de garder le tableau blanc
      instant: true,
      guest_join_url: true
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Erreur Lessonspace:', data);
    return NextResponse.json({ error: 'Échec de la création de l’espace Lessonspace', details: data }, { status: 500 });
  }

  return NextResponse.json({
    url_tuteur: data.url,           // lien host
    url_eleve: data.guest_url       // lien invité
  });
}
