// Fichier : app/api/lessonspace/replay/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { space_id } = await req.json();

    if (!space_id) {
      console.error('❌ space_id manquant dans la requête');
      return NextResponse.json({ error: 'Missing space_id' }, { status: 400 });
    }

    const response = await fetch(`https://api.lessonspace.com/v1/spaces/${space_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LESSONSPACE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = await response.text();
    console.log('📦 Réponse brute de Lessonspace :', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON :', parseError);
      return NextResponse.json({ error: 'Réponse invalide de Lessonspace' }, { status: 500 });
    }

    if (!response.ok || !data || !data.space) {
      console.error('❌ Erreur dans la réponse Lessonspace :', data);
      return NextResponse.json({ error: data?.error || 'Erreur inconnue' }, { status: response.status });
    }

    return NextResponse.json({ replay_url: data.space.replay_url });

  } catch (error) {
    console.error('❌ Erreur interne dans /api/lessonspace/replay:', error);
    return NextResponse.json({ error: 'Erreur interne serveur' }, { status: 500 });
  }
}
