// Fichier : app/dashboard/tuteur/horaire/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addMinutes from 'date-fns/addMinutes';
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

    try {
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
    } catch (err: any) {
      alert("Erreur : " + err.message);
    }
  };

  const handleSelectEvent = (event: any) => {
    setSelectedSeance(event);
  };

  const handleDeleteSeance = async () => {
    if (!selectedSeance?.id) return;
    await fetch(`/api/seances`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedSeance.id })
    });
    alert('Séance supprimée');
    location.reload();
  };

  const handleCompleterSeance = async () => {
    const dureeReelle = prompt("Durée réelle (min) :");
    if (!dureeReelle || isNaN(Number(dureeReelle))) return;

    try {
      const response = await fetch('/api/lessonspace/replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ space_id: selectedSeance.lien?.split('/').pop() })
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
          id: selectedSeance.id,
          completee: true,
          duree_reelle: parseInt(dureeReelle),
          lien_revoir: data.replay_url
        })
      });

      alert("Séance complétée!");
      location.reload();
    } catch (err: any) {
      alert("Erreur : " + err.message);
    }
  };

  const handleAccederSeance = async () => {
    if (!selectedSeance?.id) return;
    await fetch(`/api/seances`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedSeance.id,
        accedee: true
      })
    });
    window.open(selectedSeance.lien, '_blank');
    location.reload();
  };

  // Déterminer les bornes horaires (min et max)
  const defaultMin = new Date(0, 0, 0, 6, 0);
  const defaultMax = new Date(0, 0, 0, 22, 0);
  const minTime = seances.length > 0 ? seances.reduce((min, s) => new Date(s.debut) < min ? new Date(s.debut) : min, defaultMin) : defaultMin;
  const maxTime = seances.length > 0 ? seances.reduce((max, s) => new Date(s.fin) > max ? new Date(s.fin) : max, defaultMax) : defaultMax;

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
          title: s.sujet || 'Séance',
          start: new Date(s.debut),
          end: new Date(s.fin),
          ...s
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 250px)' }}
        defaultView={Views.WEEK}
        onSelectEvent={handleSelectEvent}
        min={minTime}
        max={maxTime}
        scrollToTime={minTime}
      />

      {selectedSeance && (
        <div className="mt-4 border p-4 rounded bg-gray-50">
          <h3 className="font-bold mb-2">Séance sélectionnée</h3>
          <div className="flex flex-wrap gap-2">
            {!selectedSeance.completee && (
              <>
                <button onClick={handleAccederSeance} className="bg-blue-500 text-white px-3 py-1 rounded">Accéder</button>
                {selectedSeance.accedee && (
                  <button onClick={handleCompleterSeance} className="bg-green-500 text-white px-3 py-1 rounded">Compléter</button>
                )}
                <button onClick={handleDeleteSeance} className="bg-red-500 text-white px-3 py-1 rounded">Supprimer</button>
              </>
            )}
            {selectedSeance.accedee && selectedSeance.completee && selectedSeance.lien_revoir && (
              <a href={selectedSeance.lien_revoir} target="_blank" rel="noreferrer">
                <button className="bg-purple-500 text-white px-3 py-1 rounded">Revoir</button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
