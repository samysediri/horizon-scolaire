'use client';

import { useState } from 'react';

export default function InviterUtilisateur() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('eleve');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          metadata: {
            prenom,
            nom,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur lors de l'invitation");

      setSuccess(true);
      setPrenom('');
      setNom('');
      setEmail('');
      setRole('eleve');
    } catch (err: any) {
      console.error('Erreur dans handleSubmit:', err);
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inviter un utilisateur</h1>

      {success && <p className="text-green-600 mb-4">Invitation envoyée avec succès!</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Prénom"
          className="w-full p-2 border rounded"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          className="w-full p-2 border rounded"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Courriel"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="eleve">Élève</option>
          <option value="parent">Parent</option>
          <option value="tuteur">Tuteur</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Envoyer l'invitation
        </button>
      </form>
    </div>
  );
}
