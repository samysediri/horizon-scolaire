import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiKey = process.env.LESSONSPACE_API_KEY;

    if (!apiKey) {
      console.error('[ERREUR] Clé API manquante');
      return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });
    }

    const res = await fetch('https://api.thelessonspace.com/v2/spaces/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: 'Séance Horizon Scolaire',
        subject: 'Tutorat',
        expires_at: null,
        allow_guest_access: true,
        instant: true,
        record: false,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Lessonspace API Error]', JSON.stringify(data, null, 2));
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({
      url_tuteur: data.url,
      url_eleve: data.guest_url,
    });
  } catch (err: any) {
    console.error('[Server Error]', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
