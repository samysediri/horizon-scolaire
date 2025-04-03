import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ConfirmClient = dynamic(() => import('./ConfirmClient'), { ssr: false })

export default function Page() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ConfirmClient />
    </Suspense>
  )
}
