'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useMemo, useState } from 'react';
import { startOfMonth, endOfMonth, format, subMonths, addMonths } from 'date-fns';
import fr from 'date-fns/locale/fr';
import Link from 'next/link';

export default function HeuresCompletees() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [prenom, setPrenom] = useState('');
  const [message, setMessage] = useState('Chargement...');
  const [seances, setSeances] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchInfos = async () => {
      if (!user?.id) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setMessage("Profil non trouvé.");
        return;
      }

      setPrenom(profile.first_name);

      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      const { data: seanceData, error: seanceError } = await supabase
        .from('seances')
        .select('*')
        .eq('tuteur_id', user.id)
        .gte('date', start)
        .lte('date', end)
        .eq('completee', true);

      if (seanceError || !seanceData) {
        setMessage("Erreur de chargement des séances.");
        return;
      }

      setSeances(seanceData);
    };

    fetchInfos();
  }, [user, currentMonth]);

  const groupedByEleve = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const s of seances) {
      if (!s.duree_reelle) continue;
      if (!grouped[s.eleve_nom]) grouped[s.eleve_nom] = 0;
      grouped[s.eleve_nom] += s.duree_reelle;
    }
    return grouped;
  }, [seances]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {prenom ? `Bonjour, ${prenom}! 👋` : message}
        </h1>

        <div className="mb-6 flex gap-6 text-sm text-blue-600">
          <Link href="/dashboard/tuteur" className="hover:underline">⬅ Retour à l'horaire</Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
          >
            ← Mois précédent
          </button>
          <span className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
          >
            Mois suivant →
          </button>
        </div>

        <table className="w-full text-left border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">👤 Élève</th>
              <th className="p-3 border">⏱️ Heures complétées</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByEleve).map(([eleve, minutes]) => (
              <tr key={eleve} className="hover:bg-gray-50">
                <td className="p-3 border font-medium">{eleve}</td>
                <td className="p-3 border">{(minutes / 60).toFixed(2)} h</td>
              </tr>
            ))}
            {Object.keys(groupedByEleve).length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-center italic text-gray-500">
                  Aucune séance complétée pour ce mois.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
