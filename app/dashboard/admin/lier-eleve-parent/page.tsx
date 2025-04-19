'use client';

import { useState, useEffect } from 'react';

export default function LierEleveParent() {
  const [eleves, setEleves] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [eleveId, setEleveId] = useState('');
  const [parentId, setParentId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const [resEleves, resParents] = await Promise.all([
        fetch('/api/get-eleves'),
        fetch('/api/get-parents'),
      ]);

      const elevesData = await resEleves.json();
      const parentsData = await resParents.json();

      setEleves(elevesData);
      setParents(parentsData);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/lier-eleve-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eleveId, parentId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erreur lors de la liaison');

      setSuccess(true);
      setEleveId('');
      setParentId('');
    } catch (err: any) {
      console.error('Erreur dans handleSubmit:', err);
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lier un élève à un parent</h1>

      {success && <p className="text-green-600 mb-4">Liaison effectuée avec succès!</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={eleveId}
          onChange={(e) => setEleveId(e.target.value)}
          required
        >
          <option value="">Sélectionner un élève</option>
          {eleves.map((eleve) => (
            <option key={eleve.id} value={eleve.id}>
              {eleve.nom} ({eleve.email})
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          required
        >
          <option value="">Sélectionner un parent</option>
          {parents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.nom} ({parent.email})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lier
        </button>
      </form>
    </div>
  );
}
