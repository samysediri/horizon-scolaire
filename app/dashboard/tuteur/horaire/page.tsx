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

export default function HoraireTuteur() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [eleves, setEleves] = useState<any[]>([]);
  const [seances, setSeances] = useState<any[]>([]);
  const [newSeance, setNewSeance] = useState({ date: '', heure: '', duree: '', recurrence: 1 });
  const [selectedEleveId, setSelectedEleveId] = useState('');
  const [popup, setPopup] = useState<{ x: number; y: number; seance: any } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

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

    const eleve = eleves.find(e => e.id === selectedEleveId);
    if (!eleve) {
      alert("Élève introuvable.");
      return;
    }

    let baseLessonspaceUrl = eleve?.lien_lessonspace || '';
    baseLessonspaceUrl = baseLessonspaceUrl.replace('https://www.', 'https://app.');

    if (!baseLessonspaceUrl.startsWith('https://app.thelessonspace.com/')) {
      alert("Lien Lessonspace invalide pour cet élève.");
      return;
    }

    const lienTuteur = `${baseLessonspaceUrl}#teacher`;
    const lienEleve = `${baseLessonspaceUrl}#student`;

    const res = await fetch('/api/seances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tuteur_id: user?.id,
        eleve_id: selectedEleveId,
        date: newSeance.date,
        heure: newSeance.heure,
        duree: newSeance.duree,
        eleve_nom: `${eleve?.prenom || ''} ${eleve?.nom || ''}`.trim(),
        lien_tuteur: lienTuteur,
        lien_eleve: lienEleve,
        duree_reelle: null
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Erreur');

    alert('Séance ajoutée!');
    location.reload();
  };

  const handleDeleteSeance = async (id: string) => {
    if (!confirm('Supprimer cette séance?')) return;

    const res = await fetch('/api/seances', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Erreur');

    alert('Séance supprimée!');
    location.reload();
  };

  const handleSelectEvent = (event: any, e: any) => {
    e.preventDefault();
    setPopup({ x: e.clientX, y: e.clientY, seance: event });
  };

  const marquerSeanceVue = (id: string) => {
    const vues = JSON.parse(localStorage.getItem('seancesVues') || '[]');
    if (!vues.includes(id)) {
      vues.push(id);
      localStorage.setItem('seancesVues', JSON.stringify(vues));
    }
  };

  const estVue = (id: string) => {
    const vues = JSON.parse(localStorage.getItem('seancesVues') || '[]');
    return vues.includes(id);
  };

  const enregistrerDureeReelle = async (id: string) => {
    const input = prompt('Durée réelle en minutes?');
    if (!input || isNaN(Number(input))) return alert('Valeur invalide');

    const duree = Number(input);

    const res = await fetch('/api/seances', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, duree_reelle: duree, completee: true })
    });

    const data = await res.json();
    if (!res.ok) return alert(data?.error || 'Erreur');

    await fetch('/api/factures/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seance_id: id })
    });

    alert('Séance complétée et ajoutée à la facture!');
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
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">🗓️ Horaire Tuteur</h1>

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

      <div className="h-[60vh] mt-6">
        <Calendar
          localizer={localizer}
          events={seances.map(s => ({
            id: s.id,
            title: s.eleve_nom || 'Séance',
            start: new Date(s.debut),
            end: new Date(s.fin),
            ...s
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', fontSize: '0.75rem' }}
          defaultView={Views.WEEK}
          min={minTime}
          max={maxTime}
          scrollToTime={minTime}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {popup && (
        <div
          className="absolute bg-white border shadow-xl rounded-lg p-4 z-50"
          style={{ top: popup.y + 10, left: popup.x + 10 }}
        >
          <h3 className="text-md font-bold mb-1">{popup.seance.eleve_nom}</h3>
          <p className="text-sm mb-2">🕒 {new Date(popup.seance.start).toLocaleTimeString()} à {new Date(popup.seance.end).toLocaleTimeString()}</p>
          {popup.seance.duree_reelle ? (
            <p className="text-green-600 font-semibold">✔️ Complété ({popup.seance.duree_reelle} min)</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  marquerSeanceVue(popup.seance.id);
                  window.open(popup.seance.lien_tuteur, '_blank');
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Accéder
              </button>
              {estVue(popup.seance.id) && (
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                  onClick={() => enregistrerDureeReelle(popup.seance.id)}
                >
                  Compléter
                </button>
              )}
              <button
                onClick={() => handleDeleteSeance(popup.seance.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          )}
          <div className="mt-2">
            <button
              onClick={() => setPopup(null)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
