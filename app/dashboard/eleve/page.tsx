'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function DashboardEleve() {
  const [user, setUser] = useState(null);
  const [eleve, setEleve] = useState(null);
  const [seances, setSeances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('Démarrage...');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      setDebug('Etape 1 : récupération utilisateur...');
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setDebug(`Erreur utilisateur : ${userError?.message || 'non connecté'}`);
        router.push('/login');
        return;
      }

      setUser(user);
      setDebug(`Etape 2 : utilisateur détecté : ${user.id}`);

      const { data: profil, error: profilError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profilError || !profil) {
        setDebug(`Erreur ou profil introuvable : ${profilError?.message || 'aucun profil'}`);
        return;
      }

      setEleve(profil);

      const { data: seancesData, error: seanceErr } = await supabase
        .from('seances')
        .select('*')
        .eq('eleve_id', user.id);

      if (seanceErr) {
        setDebug(`Erreur chargement séances : ${seanceErr.message}`);
        return;
      }

      setSeances(seancesData || []);
      setDebug('Données chargées avec succès!');
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <p>{debug}</p>;
  if (!eleve) return <p>{debug}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue {eleve.prenom} {eleve.nom}
      </h1>
      <p className="mb-2">📧 {eleve.email}</p>
      <p className="mb-2">
        🎯 Lien Lessonspace :{' '}
        <a className="text-blue-600 underline" href={eleve.lien_lessonspace}>
          {eleve.lien_lessonspace}
        </a>
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Mon horaire</h2>
      <div className="border rounded p-4 bg-white">
        <Calendar
          localizer={localizer}
          events={seances.map((s: any) => ({
            id: s.id,
            title: s.sujet || 'Séance',
            start: new Date(s.debut),
            end: new Date(s.fin),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          defaultView={Views.WEEK}
        />
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Se déconnecter
      </button>

      <div className="mt-4 text-sm text-gray-500">✅ {debug}</div>
    </div>
  );
}
