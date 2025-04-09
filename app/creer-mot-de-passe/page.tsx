// app/creer-mot-de-passe/page.tsx

import { Suspense } from 'react'
import CreatePasswordClient from './CreatePasswordClient'

export const metadata = {
  title: 'Créer un mot de passe',
}

export default function CreatePasswordPage() {
  return (
    <>
      <h1>Créer un mot de passe</h1>
      <Suspense fallback={<p>Chargement...</p>}>
        <CreatePasswordClient />
      </Suspense>
    </>
  )
}
