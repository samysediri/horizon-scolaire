'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()

  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session || !session.user) {
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        console.error('Erreur lors de la récupération du rôle', profileError)
        setRole(null)
      } else {
        setRole(profile.role)
      }

      setLoading(false)
    }

    fetchRole()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p className="p-4">Chargement...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          🔒 Se déconnecter
        </button>
      </div>

      {role ? (
        <div>
          <p className="text-green-700 text-lg mb-4">
            ✅ Vous êtes connecté en tant que <strong>{role}</strong>.
          </p>

          {role === 'admin' && (
            <div className="space-y-2">
              <Link
                href="/dashboard/admin/ajouter-tuteur"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ➕ Ajouter un tuteur
              </Link>
              <br />
              <Link
                href="/dashboard/admin/ajouter-eleve"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ➕ Ajouter un élève
              </Link>
            </div>
          )}

          {role === 'tuteur' && <p>📚 Vous pouvez voir vos élèves ici.</p>}
          {role === 'parent' && <p>👨‍👩‍👧 Vous pouvez voir les séances de vos enfants ici.</p>}
          {role === 'eleve' && <p>🎓 Vos prochaines séances apparaîtront ici.</p>}
        </div>
      ) : (
        <p className="text-red-600">❌ Impossible de déterminer votre rôle.</p>
      )}
    </div>
  )
}
