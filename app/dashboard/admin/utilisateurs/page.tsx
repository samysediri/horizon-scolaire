'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UtilisateursAdmin() {
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [filtre, setFiltre] = useState<string>('tous')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      setLoading(true)
      let query = supabase.from('profiles').select('id, nom, email, role')

      if (filtre !== 'tous') {
        query = query.eq('role', filtre)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error)
      } else {
        setUtilisateurs(data || [])
      }

      setLoading(false)
    }

    fetchUtilisateurs()
  }, [filtre])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Utilisateurs</h1>

      <label className="block mb-2 font-semibold">Filtrer par rôle :</label>
      <select
        className="mb-4 border rounded p-2"
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
      >
        <option value="tous">Tous</option>
        <option value="admin">Admins</option>
        <option value="tuteur">Tuteurs</option>
        <option value="parent">Parents</option>
        <option value="eleve">Élèves</option>
      </select>

      {loading ? (
        <p>Chargement...</p>
      ) : utilisateurs.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <table className="border w-full mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nom</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Rôle</th>
              <th className="border p-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.nom || '—'}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2 text-xs">{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
