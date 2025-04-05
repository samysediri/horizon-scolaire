// app/test/page.tsx
'use client'

export default function PageTest() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>✅ Cette page fonctionne</h1>
      <p>Si tu vois ceci, alors `/test` est bien rendu côté client.</p>
    </div>
  )
}

export const dynamic = 'force-dynamic'
