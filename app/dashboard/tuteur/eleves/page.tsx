"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function MesElevesPage() {
  const user = useUser();
  const [eleves, setEleves] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      console.log("[Client] Utilisateur pas encore chargé...");
      return;
    }

    const fetchEleves = async () => {
      console.log("[Client] Utilisateur détecté :", user.id);
      const res = await fetch("/api/tuteurs/eleves"); // ✅ appel API corrigé
      const data = await res.json();
      console.log("[DEBUG] Élèves reçus :", data);
      setEleves(data || []);
    };

    fetchEleves();
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mes élèves</h1>
      {eleves.length === 0 ? (
        <p>Aucun élève trouvé.</p>
      ) : (
        <ul className="space-y-2">
          {eleves.map((eleve, i) =>
            eleve ? (
              <li key={i} className="border p-4 rounded shadow">
                <p className="font-semibold">
                  {eleve.prenom} {eleve.nom}
                </p>
                <p className="text-sm text-gray-600">{eleve.email}</p>
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}
