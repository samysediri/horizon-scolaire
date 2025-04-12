import { Suspense } from 'react'
import CreatePasswordClient from './CreatePasswordClient'

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CreatePasswordClient />
    </Suspense>
  )
}
