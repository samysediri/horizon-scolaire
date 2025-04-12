// app/update-password/page.tsx

import { Suspense } from 'react'
import UpdatePasswordClient from './UpdatePasswordClient'

export const metadata = {
  title: 'Réinitialiser le mot de passe',
}

export default function UpdatePasswordPage() {
  return (
    <div>
      <h1>Réinitialisation du mot de passe</h1>
      <Suspense fallback={<p>Chargement...</p>}>
        <UpdatePasswordClient />
      </Suspense>
    </div>
  )
}
