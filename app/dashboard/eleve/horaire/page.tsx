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

  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  // Capturer la position de la souris en continu
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSelectEvent = (event: any) => {
    setPopup({ x: cursorPosition.x, y: cursorPosition.y, seance: event });
  };

  const defaultMin = new Date();
  defaultMin.setHours(6, 0, 0, 0);

  const defaultMax = new Date();
  defaultMax.setHours(22, 0, 0, 0);

  if (loading) return <p className="p-6 text-gray-500">{debug}</p>;

  return (
    <div className="p-6 relative flex flex-col items-center min-h-screen bg-[#F8FAFC]">
      <h1 className="text-3xl font-bold mb-6 text-[#0D1B2A]">🗓️ Mon horaire</h1>

      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
        <div style={{ height: '75vh' }}>
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
            defaultView={Views.WEEK}
            style={{ height: '100%', fontSize: '0.85rem' }}
            min={defaultMin}
            max={defaultMax}
            scrollToTime={defaultMin}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>

      {popup && (
        <div
          className="absolute bg-white border shadow-xl rounded-lg p-4 z-50"
          style={{ top: popup.y + 10, left: popup.x + 10 }}
        >
          <h3 className="text-md font-bold mb-2 text-[#0D1B2A]">Séance</h3>
          <p className="text-sm mb-4 text-gray-600">
            🕒 {new Date(popup.seance.start).toLocaleTimeString()} à {new Date(popup.seance.end).toLocaleTimeString()}
          </p>
          {popup.seance.lien_eleve && (
            <button
              onClick={() => window.open(popup.seance.lien_eleve, '_blank')}
              className="bg-[#62B6CB] text-white px-3 py-1 rounded mr-2 hover:bg-[#539eb1]"
            >
              Accéder
            </button>
          )}
          <button
            onClick={() => setPopup(null)}
            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">{debug}</div>
    </div>
  );
}
