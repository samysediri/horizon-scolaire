// TEMPORAIRE — route de test : app/api/lessonspace/create/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.LESSONSPACE_API_KEY;

  // On retourne directement la valeur
  return NextResponse.json({ apiKey: apiKey || 'NON TROUVÉE' });
}
