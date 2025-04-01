'use client';

import { useState } from 'react';

export default function AjouterTuteur() {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Envoi de l'invitation en cours...");

    const response = await fetch('/api/invite-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        role: 'tuteur',
        metadata: {
          prenom: form.prenom,
          nom: form.nom
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('✅ Invitation envoyée avec succès.');
    } else {
      setMessage('❌ Erreur : ' + (result.error || 'Impossible d’envoyer l’invitation.'));
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un tuteur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="email" name="email" placeholder="Courriel" onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Envoyer l'invitation</button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
