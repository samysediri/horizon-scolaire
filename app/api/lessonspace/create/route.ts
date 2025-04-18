import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true, message: 'Endpoint détecté.' });
}

export async function POST() {
  const apiKey = process.env.LESSONSPACE_API_KEY;

  if (!apiKey) {
    console.error('❌ Clé API manquante');
    return NextResponse.json({ error: 'API key manquante' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.thelessonspace.com/v2/spaces/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Séance Horizon Scolaire',
        subject: 'Tutorat',
        guest_join_url: true,
        settings: {
          whiteboard: true
        }
      })
    });

    const data = await response.json();
    console.log('[Lessonspace API] Réponse brute:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({
      url: data.url,
      invite_url: data.invite_url,
      space_id: data.space_id
    });
  } catch (error) {
    console.error('❌ Erreur lors de la requête à Lessonspace:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
