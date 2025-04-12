'use client'

import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="p-4 border-b mb-4">
      <Link href="/dashboard">Accueil</Link>
      <span className="mx-2">|</span>
      <Link href="/dashboard/admin/ajouter-tuteur">Ajouter un tuteur</Link>
    </nav>
  )
}
