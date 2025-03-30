// Fichier : app/dashboard/tuteur/horaire/page.jsx
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from ' 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addMinutes from 'date-fns/addMinutes';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardTuteur() {
  const [userId, setUserId] = useState('');
  const [eleves, setEleves] = useState([]);
  const [seances, setSeances] = useState([]);
  const [newSeance, setNewSeance] = useState({ date: '', heure: '', duree: '', recurrence: 1 });
  const [selectedEleveId, setSelectedEleveId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        const { data: eleves } = await supabase
          .from('eleves')
          .select('*')
          .eq('tuteur_id', user.id);
        setEleves(eleves || []);

        const { data: seances } = await supabase
          .from('seances')
          .select('*')
          .eq('tuteur_id', user.id);
        setSeances(seances || []);
      }
    };
    fetchData();
  }, []);

  const handleAddSeance = async () => {
    if (!selectedEleveId || !newSeance.date || !newSeance.heure || !newSeance.duree) {
      alert('Champs manquants');
      return;
    }

    try {
      const response = await fetch('/api/lessonspace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Seance_${newSeance.date}_${newSeance.heure}` }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Erreur Lessonspace : ${response.status} - ${JSON.stringify(data) || 'Réponse invalide'}`);
        return;
      }

      const lienLessonspace = data?.url || null;

      const { error } = await supabase.from('seances').insert({
        tuteur_id: userId,
        eleve_id: selectedEleveId,
        date: newSeance.date,
        heure: newSeance.heure,
        duree: newSeance.duree,
        lien_lessonspace: lienLessonspace,
      });

      if (error) {
        alert(`Erreur Supabase : ${error.message}`);
        return;
      }

      alert('Séance ajoutée!');
      location.reload();
    } catch (err) {
      alert("Erreur inattendue : " + err.message);
    }
  };

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
          title: 'Séance',
          start: new Date(`${s.date}T${s.heure}`),
          end: addMinutes(new Date(`${s.date}T${s.heure}`), parseInt(s.duree))
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}
