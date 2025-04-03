'use client';

import { Suspense } from 'react';
import CallbackClient from './CallbackClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CallbackClient />
    </Suspense>
  );
}
