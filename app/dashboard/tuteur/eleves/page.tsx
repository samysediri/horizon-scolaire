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
      if (!user?.id) {
        console.log('[Client] Utilisateur pas encore chargé...');
        return;
      }

      try {
        console.log('[Client] TENTATIVE FETCH : /api/tuteurs/eleves?tuteur_id=', user.id);

        const res = await fetch(`/api/tuteurs/eleves?tuteur_id=${user.id}`);
        const data = await res.json();

        console.log('[Client] Résultat brut de /api/tuteurs/eleves =', data);

        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération des élèves');
        }

        setEleves(data);
      } catch (err: any) {
        console.error('[Client] Erreur lors du fetch des élèves :', err.message);
        setError('Impossible de charger les élèves.');
      } finally {
        setLoading(false);
      }
    };

    fetchEleves();
  }, [user]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes élèves</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2 mt-4">
        {eleves.map((eleve) => (
          <li key={eleve.id} className="p-2 border rounded">
            <strong>{eleve.prenom} {eleve.nom}</strong><br />
            <span className="text-sm text-gray-600">{eleve.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
