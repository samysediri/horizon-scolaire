'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

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
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

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
      <h1 className="text-2xl font-bold mb-6">💵 Mes factures</h1>

      {factures.length === 0 ? (
        <p className="text-gray-500">Aucune facture trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Montant</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lien</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((facture) => (
                <tr key={facture.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {format(new Date(facture.created_at), 'd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {facture.montant ? `${facture.montant.toFixed(2)} $` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {facture.payee ? (
                      <span className="text-green-600 font-semibold">Payée</span>
                    ) : (
                      <span className="text-red-500 font-semibold">À payer</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {facture.lien_stripe ? (
                      <a
                        href={facture.lien_stripe}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Voir la facture
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">{debug}</div>
    </div>
  );
}
