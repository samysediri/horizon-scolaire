// Fichier : /app/dashboard/layout.js
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('role')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6 space-y-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Horizon Scolaire</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard/tuteur" className="hover:underline">Accueil</Link>
          <Link href="/dashboard/tuteur/horaire" className="hover:underline">Horaire</Link>
          <Link href="/dashboard/tuteur/heures" className="hover:underline">Heures complétées</Link>
          <Link href="/dashboard/tuteur/eleves" className="hover:underline">Élèves</Link>
          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Se déconnecter
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <header className="bg-blue-600 text-white py-4 px-6 shadow-md md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold">Horizon Scolaire</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Se déconnecter
          </button>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
        <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Horizon Scolaire. Tous droits réservés.
        </footer>
      </div>
    </div>
  )
}
