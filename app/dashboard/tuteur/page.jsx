'use client'
import Link from 'next/link'

export default function AccueilTuteur() {
  const user = useUser();
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {typeof window !== 'undefined' && user?.user_metadata?.role === 'admin' && (
        <a href="/dashboard/admin" className="text-blue-500 underline">Aller au tableau de bord Admin</a>
      )}
      <h1 className="text-3xl font-bold mb-6">Tableau de bord du tuteur</h1>
      <ul className="space-y-4">
        <li><Link href="/dashboard/tuteur/horaire" className="text-blue-600 hover:underline">Voir l’horaire</Link></li>
        <li><Link href="/dashboard/tuteur/eleves" className="text-blue-600 hover:underline">Voir les élèves</Link></li>
        <li><Link href="/dashboard/tuteur/heures" className="text-blue-600 hover:underline">Voir les heures complétées</Link></li>
      </ul>
    </div>
  )
}
