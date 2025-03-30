// Fichier : app/api/lessonspace/create/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name } = await req.json();
    const apiKey = process.env.LESSONSPACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });
    }

    const response = await fetch('https://api.lessonspace.com/v1/spaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name,
        subject: 'tutoring',
        group: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data?.error || 'Erreur API inconnue' }, { status: response.status });
    }

    return NextResponse.json({ url: data?.space?.url || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
