import { Suspense } from 'react'
import ConfirmWrapper from './ConfirmWrapper'

export default function Page() {
  return (
    <Suspense fallback={<div>Redirection...</div>}>
      <ConfirmWrapper />
    </Suspense>
  )
}
