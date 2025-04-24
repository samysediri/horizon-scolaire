"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function MesElevesPage() {
  const user = useUser();
  const [eleves, setEleves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement

  useEffect(() => {
    if (!user) return;

    const fetchEleves = async () => {
      const res = await fetch("/api/tuteurs/eleves");
      const data = await res.json();
      setEleves(data || []);
      setLoading(false); // Fin du chargement
    };

    fetchEleves();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">👩‍🎓 Mes élèves</h1>

        {loading ? (
          <p className="text-center text-gray-500 italic">Chargement...</p>
        ) : eleves.length === 0 ? (
          <p className="text-center text-gray-500">Aucun élève trouvé.</p>
        ) : (
          <ul className="space-y-4">
            {eleves.map((eleve, i) =>
              eleve ? (
                <li
                  key={i}
                  className="border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <p className="text-lg font-semibold text-gray-800">
                    {eleve.prenom} {eleve.nom}
                  </p>
                  <p className="text-sm text-gray-600">{eleve.email}</p>
                </li>
              ) : null
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
