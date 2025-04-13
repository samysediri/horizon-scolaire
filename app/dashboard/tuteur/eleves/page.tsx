// Fichier : app/dashboard/tuteur/eleves/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

export default function ListeElevesTuteur() {
  const user = useUser();
  const [eleves, setEleves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEleves = async () => {
      if (!user) {
        console.log('[Client] Utilisateur pas encore chargé...');
        return;
      }

      console.log('[Client] Utilisateur ID :', user.id);

      try {
        const res = await fetch(`/api/tuteurs/eleves?tuteur_id=${user.id}`);
        const data = await res.json();

        console.log('[Client] Réponse de /api/tuteurs/eleves :', data);

        if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement');

        setEleves(data);
      } catch (err: any) {
        console.error('[Client] Erreur fetch élèves :', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEleves();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mes élèves</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}
      {eleves.length === 0 && !loading && <p>Aucun élève trouvé.</p>}
      <ul className="list-disc pl-5">
        {eleves.map((eleve) => (
          <li key={eleve.id}>
            {eleve.prenom} {eleve.nom} — {eleve.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
