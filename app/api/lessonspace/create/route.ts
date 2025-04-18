import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.LESSONSPACE_API_KEY;

  if (!apiKey) {
    console.error('❌ Clé API manquante');
    return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.thelessonspace.com/v2/spaces/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Séance Horizon Scolaire',
        subject: 'Tutorat',
        guest_join_url: true,
        settings: {
          whiteboard: true,
          chat: true
        }
      })
    });

    const data = await response.json();
    console.log('[Lessonspace API] Réponse brute:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({
      url: data.url,               // Lien pour le tuteur (host)
      invite_url: data.invite_url, // Lien pour l'élève (invité)
      space_id: data.space_id
    });
  } catch (error) {
    console.error('❌ Erreur API Lessonspace:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
