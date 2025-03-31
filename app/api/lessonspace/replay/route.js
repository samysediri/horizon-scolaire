// Fichier : app/api/lessonspace/replay/route.js
"use server";

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { space_id } = await req.json();

    if (!space_id) {
      return NextResponse.json({ error: 'Missing space_id' }, { status: 400 });
    }

    const response = await fetch(`https://api.lessonspace.com/v1/spaces/${space_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LESSONSPACE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok || !data || !data.space) {
      return NextResponse.json({ error: data?.error || 'Erreur inconnue' }, { status: response.status });
    }

    return NextResponse.json({ replay_url: data.space.replay_url });

  } catch (error) {
    console.error('Erreur dans /api/lessonspace/replay:', error);
    return NextResponse.json({ error: 'Erreur interne serveur' }, { status: 500 });
  }
}
