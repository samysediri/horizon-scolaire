// Fichier : app/api/lessonspace/create/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Nom manquant' }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.thelessonspace.com/v1/spaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LESSONSPACE_API_KEY}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Erreur inconnue' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
