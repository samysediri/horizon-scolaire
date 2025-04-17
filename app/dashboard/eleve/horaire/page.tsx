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
  const [popup, setPopup] = useState<{ x: number; y: number; seance: any } | null>(null);

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

  const handleSelectEvent = (event: any, e: any) => {
    e.preventDefault();
    setPopup({ x: e.clientX, y: e.clientY, seance: event });
  };

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
    <div className="p-6 relative">
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
        style={{ height: 'calc(100vh - 100px)', fontSize: '0.75rem' }}
        defaultView={Views.WEEK}
        min={minTime}
        max={maxTime}
        scrollToTime={minTime}
        onSelectEvent={handleSelectEvent}
      />

      {popup && (
        <div
          className="absolute bg-white border shadow-xl rounded-lg p-4 z-50"
          style={{ top: popup.y + 10, left: popup.x + 10 }}
        >
          <h3 className="text-md font-bold mb-1">Séance</h3>
          <p className="text-sm mb-2">🕒 {new Date(popup.seance.start).toLocaleTimeString()} à {new Date(popup.seance.end).toLocaleTimeString()}</p>
          <button
            onClick={() => window.open(popup.seance.lien, '_blank')}
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
          >
            Accéder
          </button>
          <button
            onClick={() => setPopup(null)}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">{debug}</div>
    </div>
  );
}
