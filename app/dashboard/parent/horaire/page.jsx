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

export default function HoraireParent() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [enfants, setEnfants] = useState<any[]>([]);
  const [selectedEnfantId, setSelectedEnfantId] = useState('');
  const [seances, setSeances] = useState<any[]>([]);
  const [popup, setPopup] = useState<{ x: number; y: number; seance: any } | null>(null);
  const [debug, setDebug] = useState('Chargement en cours...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnfants = async () => {
      if (!user) return;

      setDebug('🔄 Chargement des enfants...');

      const { data: liendata, error: lienerror } = await supabase
        .from('eleves_parents')
        .select('eleve_id')
        .eq('parent_id', user.id);

      if (lienerror || !liendata) {
        setDebug(`❌ Erreur de lien : ${lienerror?.message}`);
        setLoading(false);
        return;
      }

      const eleveIds = liendata.map((lien) => lien.eleve_id);

      if (eleveIds.length === 0) {
        setDebug('⚠️ Aucun enfant trouvé.');
        setLoading(false);
        return;
      }

      const { data: elevesData, error: elevesError } = await supabase
        .from('eleves')
        .select('id, prenom, nom')
        .in('id', eleveIds);

      if (elevesError) {
        setDebug(`❌ Erreur de chargement des élèves : ${elevesError.message}`);
      } else {
        setEnfants(elevesData || []);
        setDebug('✅ Enfants chargés');
      }

      setLoading(false);
    };

    fetchEnfants();
  }, [user, supabase]);

  useEffect(() => {
    const fetchSeances = async () => {
      if (!selectedEnfantId) return;

      setDebug('🔄 Chargement des séances...');

      const { data, error } = await supabase
        .from('seances')
        .select('*')
        .eq('eleve_id', selectedEnfantId);

      if (error) {
        setDebug(`❌ Erreur des séances : ${error.message}`);
      } else {
        setSeances(data || []);
        setDebug('✅ Séances chargées');
      }
    };

    fetchSeances();
  }, [selectedEnfantId, supabase]);

  const handleSelectEvent = (event: any, e: any) => {
    e.preventDefault();
    setPopup({ x: e.clientX, y: e.clientY, seance: event });
  };

  const minTime = new Date();
  minTime.setHours(6, 0, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(22, 0, 0, 0);

  if (loading) return <p className="p-6 text-gray-500">{debug}</p>;

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">🗓️ Horaire des enfants</h1>

      <div className="mb-6">
        <select
          value={selectedEnfantId}
          onChange={(e) => setSelectedEnfantId(e.target.value)}
          className="p-3 border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Sélectionner un enfant --</option>
          {enfants.map((enfant) => (
            <option key={enfant.id} value={enfant.id}>
              {enfant.prenom} {enfant.nom}
            </option>
          ))}
        </select>
      </div>

      {selectedEnfantId ? (
        <div className="h-[75vh] bg-white p-4 rounded shadow">
          <Calendar
            localizer={localizer}
            events={seances.map((s) => ({
              id: s.id,
              title: s.sujet || 'Séance',
              start: new Date(s.debut),
              end: new Date(s.fin),
              ...s
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', fontSize: '0.8rem' }}
            defaultView={Views.WEEK}
            min={minTime}
            max={maxTime}
            scrollToTime={minTime}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      ) : (
        <p className="text-gray-500">Veuillez sélectionner un enfant pour afficher son horaire.</p>
      )}

      {popup && (
        <div
          className="absolute bg-white border shadow-xl rounded-lg p-4 z-50"
          style={{ top: popup.y + 10, left: popup.x + 10 }}
        >
          <h3 className="text-md font-bold mb-1">Séance</h3>
          <p className="text-sm mb-2">
            🕒 {new Date(popup.seance.start).toLocaleTimeString()} à {new Date(popup.seance.end).toLocaleTimeString()}
          </p>
          {popup.seance.lien_eleve && (
            <button
              onClick={() => window.open(popup.seance.lien_eleve, '_blank')}
              className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            >
              Accéder
            </button>
          )}
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
