import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ConfirmClient />
    </Suspense>
  );
}
