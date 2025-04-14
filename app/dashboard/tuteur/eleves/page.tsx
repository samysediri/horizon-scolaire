// Fichier : app/dashboard/tuteur/eleves/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";

export default function PageElevesTuteur() {
  const user = useUser();
  const [eleves, setEleves] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      console.log("[Client] Utilisateur pas encore chargé...");
      return;
    }

    const fetchEleves = async () => {
      console.log("[Client] Utilisateur détecté :", user.id);
      const res = await fetch(`/api/tuteurs/eleves?tuteur_id=${user.id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("[Client] Erreur API :", data?.error);
        return;
      }

      console.log("[Client] Eleves reçus :", data);
      setEleves(data);
    };

    fetchEleves();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes élèves</h1>
      {eleves.length === 0 ? (
        <p>Aucun élève trouvé.</p>
      ) : (
        <ul className="space-y-2">
          {eleves.map((e, i) => (
            <li key={i} className="border rounded p-3 shadow">
              <p className="font-semibold">{e.prenom} {e.nom}</p>
              <p className="text-sm text-gray-600">{e.email}</p>
              <p className="text-sm text-gray-500 italic">{e.lien_lessonspace}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
