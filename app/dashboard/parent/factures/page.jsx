'use client';

import { useEffect, useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function FacturesParent() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('Chargement en cours...');

  useEffect(() => {
    const fetchFactures = async () => {
      if (!user) return;
      setDebug('🔄 Chargement des factures...');

      const { data, error } = await supabase
        .from('factures')
        .select('*')
        .eq('parent_id', user.id);

      if (error) {
        setDebug(`❌ Erreur : ${error.message}`);
      } else {
        setFactures(data || []);
        setDebug('✅ Factures chargées');
      }

      setLoading(false);
    };

    fetchFactures();
  }, [user, supabase]);

  if (loading) return <p className="p-6 text-gray-500">{debug}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💵 Factures</h1>

      {factures.length === 0 ? (
        <p className="text-gray-500">Aucune facture trouvée.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Montant</th>
                <th className="py-3 px-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((facture) => (
                <tr key={facture.id} className="border-t">
                  <td className="py-3 px-4">{new Date(facture.created_at).toLocaleDateString('fr-CA')}</td>
                  <td className="py-3 px-4">{facture.montant_total ? `${facture.montant_total.toFixed(2)} $` : 'N/A'}</td>
                  <td className="py-3 px-4">
                    {facture.paye ? (
                      <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-semibold">Payée</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-xs font-semibold">En attente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">{debug}</div>
    </div>
  );
}
