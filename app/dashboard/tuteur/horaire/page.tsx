"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function DashboardTuteur() {
  const user = useUser();
  const [eleves, setEleves] = useState<any[]>([]);
  const [seances, setSeances] = useState<any[]>([]);
  const [newSeance, setNewSeance] = useState({ date: '', heure: '', duree: '', recurrence: 1 });
  const [selectedEleveId, setSelectedEleveId] = useState('');
  const [selectedSeance, setSelectedSeance] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const elevesRes = await fetch(`/api/tuteurs/eleves?tuteur_id=${user.id}`);
      const elevesData = await elevesRes.json();
      setEleves(elevesData || []);

      const seancesRes = await fetch(`/api/seances?tuteur_id=${user.id}`);
      const seancesData = await seancesRes.json();
      setSeances(seancesData || []);
    };

    fetchData();
  }, [user]);

  const handleAddSeance = async () => {
    if (!selectedEleveId || !newSeance.date || !newSeance.heure || !newSeance.duree) {
      alert('Champs manquants');
      return;
    }

    const eleve = eleves.find(e => e.id === selectedEleveId || e.id === selectedEleveId.toString());
    if (!eleve?.lien_lessonspace) {
      alert("Le lien Lessonspace de l'élève est manquant.");
      return;
    }

    const res = await fetch('/api/seances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tuteur_id: user?.id,
        eleve_id: selectedEleveId,
        date: newSeance.date,
        heure: newSeance.heure,
        duree: newSeance.duree,
        lien_lessonspace: eleve.lien_lessonspace,
        eleve_nom: `${eleve?.prenom || ''} ${eleve?.nom || ''}`
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Erreur');

    alert('Séance ajoutée!');
    location.reload();
  };

  const handleDeleteSeanceDirect = async (id: string) => {
    await fetch(`/api/seances`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    alert('Séance supprimée');
    location.reload();
  };

  const handleCompleterSeanceDirect = async (event: any) => {
    const dureeReelle = prompt("Durée réelle (en minutes):");
    if (!dureeReelle || isNaN(Number(dureeReelle))) return;

    const response = await fetch('/api/lessonspace/replay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: event.lien?.split('/').pop() })
    });

    const data = await response.json();
    if (!response.ok || !data.replay_url) {
      alert(`Erreur Lessonspace : ${response.status} - ${JSON.stringify(data)}`);
      return;
    }

    await fetch(`/api/seances`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: event.id,
        completee: true,
        duree_reelle: parseInt(dureeReelle),
        lien_revoir: data.replay_url
      })
    });

    alert("Séance complétée!");
    location.reload();
  };

  const defaultMin = new Date();
  defaultMin.setHours(6, 0, 0, 0);
  const defaultMax = new Date();
  defaultMax.setHours(22, 0, 0, 0);

  const allStarts = seances.map(s => new Date(s.debut));
  const allEnds = seances.map(s => new Date(s.fin));

  const minTime = allStarts.length ? new Date(Math.min(defaultMin.getTime(), ...allStarts.map(d => d.getTime()))) : defaultMin;
  const maxTime = allEnds.length ? new Date(Math.max(defaultMax.getTime(), ...allEnds.map(d => d.getTime()))) : defaultMax;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ajouter une séance</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <select onChange={e => setSelectedEleveId(e.target.value)} className="p-2 border rounded">
          <option value=''>Sélectionner un élève</option>
          {eleves.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
        </select>
        <input type="date" onChange={e => setNewSeance({ ...newSeance, date: e.target.value })} className="p-2 border rounded" />
        <input type="time" onChange={e => setNewSeance({ ...newSeance, heure: e.target.value })} className="p-2 border rounded" />
        <input type="number" placeholder="Durée (min)" onChange={e => setNewSeance({ ...newSeance, duree: e.target.value })} className="p-2 border rounded" />
      </div>
      <button onClick={handleAddSeance} className="bg-green-600 text-white px-4 py-2 rounded">Ajouter</button>

      <h2 className="text-lg font-semibold mt-8 mb-2">Calendrier</h2>
      <Calendar
        localizer={localizer}
        events={seances.map(s => ({
          id: s.id,
          title: s.eleve_nom,
          start: new Date(s.debut),
          end: new Date(s.fin),
          ...s
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 250px)' }}
        defaultView={Views.WEEK}
        min={minTime}
        max={maxTime}
        scrollToTime={minTime}
        onSelectEvent={(event) => setSelectedSeance(event)}
      />

      {selectedSeance && (
        <div className="fixed top-1/2 left-1/2 z-50 bg-white border shadow-xl rounded-lg p-4 transform -translate-x-1/2 -translate-y-1/2 w-[300px]">
          <h3 className="text-lg font-bold mb-2">{selectedSeance.eleve_nom}</h3>
          <p className="text-sm mb-4">🕒 {new Date(selectedSeance.start).toLocaleTimeString()} à {new Date(selectedSeance.end).toLocaleTimeString()}</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.open(selectedSeance.lien, '_blank')} className="bg-blue-500 text-white px-3 py-1 rounded">Accéder</button>
            <button onClick={() => handleDeleteSeanceDirect(selectedSeance.id)} className="bg-red-500 text-white px-3 py-1 rounded">Supprimer</button>
            {!selectedSeance.completee && selectedSeance.accedee && (
              <button onClick={() => handleCompleterSeanceDirect(selectedSeance)} className="bg-green-500 text-white px-3 py-1 rounded">Compléter</button>
            )}
            <button onClick={() => setSelectedSeance(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
