'use client';

import { useState } from 'react';

export default function AjouterEleve() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [parentNom, setParentNom] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/invite-eleve-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eleve_nom: nom,
          eleve_email: email,
          parent_nom: parentNom,
          parent_email: parentEmail
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur à la création de l’élève et du parent');

      setSuccess(true);
      setNom('');
      setEmail('');
      setParentNom('');
      setParentEmail('');
    } catch (err: any) {
      console.error('Erreur dans handleSubmit:', err);
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un élève</h1>

      {success && <p className="text-green-600 mb-4">Élève et parent invités avec succès!</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom de l'élève"
          className="w-full p-2 border rounded"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Courriel de l'élève"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom du parent"
          className="w-full p-2 border rounded"
          value={parentNom}
          onChange={(e) => setParentNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Courriel du parent"
          className="w-full p-2 border rounded"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Inviter l'élève et le parent
        </button>
      </form>
    </div>
  );
}
