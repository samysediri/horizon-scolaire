'use client'

import { createClient } from '@/lib/supabase/client'

export default function TestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔧 Page de test Supabase</h1>
      <p><strong>Supabase URL :</strong> {supabaseUrl || '❌ non défini'}</p>
      <p><strong>Supabase Anon Key :</strong> {supabaseAnonKey ? '✅ défini' : '❌ non défini'}</p>
    </div>
  )
}
