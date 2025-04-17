// Fichier : app/api/lessonspace/create/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = await fetch('https://api.lessonspace.com/v1/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LESSONSPACE_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Séance de tutorat',
        subject: 'Tutoring',
        type: 'video',
        user: { name: 'Tuteur', role: 'host' },
        guests: [{ name: 'Élève', role: 'guest' }]
      }),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data }, { status: 500 });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Erreur API Lessonspace :", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
