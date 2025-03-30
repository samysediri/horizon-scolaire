// Fichier : /app/dashboard/layout.js
'use client'

import Link from 'next/link'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Horizon Scolaire - Tableau de bord</h1>
          <nav className="space-x-6">
            <Link href="/dashboard/tuteur" className="hover:underline">Accueil</Link>
            <Link href="/dashboard/tuteur/horaire" className="hover:underline">Horaire</Link>
            <Link href="/dashboard/tuteur/heures" className="hover:underline">Heures complétées</Link>
            <Link href="/dashboard/tuteur/eleves" className="hover:underline">Élèves</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Horizon Scolaire. Tous droits réservés.
      </footer>
    </div>
  )
}
