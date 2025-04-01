
'use client';
import { useState } from 'react';
import supabase from '../../../../utils/supabase';

export default function AjouterTuteur() {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({ email, nom, prenom, role: 'tuteur' }),
    }).then(res => res.json());

    if (error) setMessage('Erreur: ' + error.message);
    else setMessage('Invitation envoyée à ' + email);
  };

  return (
    <div>
      <h1>Ajouter un tuteur</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} />
        <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
        <input type="email" placeholder="Courriel" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Envoyer l'invitation</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
