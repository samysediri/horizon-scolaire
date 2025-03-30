'use client'

import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord - Administrateur</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Link href="/dashboard/admin/ajouter-eleves">
          <div className="p-4 border rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-xl font-semibold">Ajouter un élève</h2>
            <p className="text-sm text-gray-600">Créer une fiche élève et l’assigner à un tuteur.</p>
          </div>
        </Link>

        <Link href="/dashboard/admin/eleves">
          <div className="p-4 border rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-xl font-semibold">Voir tous les élèves</h2>
            <p className="text-sm text-gray-600">Consulter les fiches existantes pour les modifier ou supprimer.</p>
          </div>
        </Link>

        <Link href="/dashboard/admin/tuteurs">
          <div className="p-4 border rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-xl font-semibold">Voir tous les tuteurs</h2>
            <p className="text-sm text-gray-600">Lister les tuteurs et gérer leurs élèves.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
