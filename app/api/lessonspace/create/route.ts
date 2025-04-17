// Fichier : app/api/lessonspace/create/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const apiKey = process.env.LESSONSPACE_API_KEY
  const spaceId = crypto.randomUUID()

  try {
    const res = await fetch('https://api.lessonspace.com/v1/spaces/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: spaceId,
        name: `Espace-${spaceId}`,
        type: 'persistent'
      })
    })

    const data = await res.json()

    if (!res.ok || !data.id) {
      console.error('[Lessonspace Error]', data)
      return NextResponse.json({ error: 'Erreur création espace', data }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      url: `https://app.lessonspace.com/space/${data.id}`,
      invite_url: `https://app.lessonspace.com/space/${data.id}?role=guest`
    })
  } catch (err) {
    console.error('[API Error]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
