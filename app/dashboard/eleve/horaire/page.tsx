'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function HoraireEleve() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [seances, setSeances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('Chargement des séances...');

  useEffect(() => {
    const fetchSeances = async () => {
      if (!user) return;
      setDebug('🔄 Récupération des séances...');

      const { data, error } = await supabase
        .from('seances')
        .select('*')
        .eq('eleve_id', user.id);

      if (error) {
        setDebug(`❌ Erreur : ${error.message}`);
      } else {
        setSeances(data || []);
        setDebug('✅ Séances chargées');
      }

      setLoading(false);
    };

    fetchSeances();
  }, [user, supabase]);

  const defaultMin = new Date();
  defaultMin.setHours(6, 0, 0, 0);
  const defaultMax = new Date();
  defaultMax.setHours(22, 0, 0, 0);

  const allStarts = seances.map(s => new Date(s.debut));
  const allEnds = seances.map(s => new Date(s.fin));

  const minTime = allStarts.length ? new Date(Math.min(defaultMin.getTime(), ...allStarts.map(d => d.getTime()))) : defaultMin;
  const maxTime = allEnds.length ? new Date(Math.max(defaultMax.getTime(), ...allEnds.map(d => d.getTime()))) : defaultMax;

  if (loading) return <p className="p-6 text-gray-500">{debug}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🗓️ Mon horaire</h1>
      <Calendar
        localizer={localizer}
        events={seances.map(s => ({
          id: s.id,
          title: s.sujet || 'Séance',
          start: new Date(s.debut),
          end: new Date(s.fin),
          ...s
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 200px)' }}
        defaultView={Views.WEEK}
        min={minTime}
        max={maxTime}
        scrollToTime={minTime}
      />

      <div className="mt-4 text-sm text-gray-500">{debug}</div>
    </div>
  );
}
