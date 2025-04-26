'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FacturesParent() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [factures, setFactures] = useState<any[]>([]);
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
        .order('date', { ascending: false });

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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">💵 Mes Factures</h1>

      {factures.length === 0 ? (
        <p className="text-gray-500">Aucune facture trouvée.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-[#0D1B2A] text-white">
              <tr>
                <th className="px-6 py-3"># Facture</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Montant</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Lien</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((facture) => (
                <tr key={facture.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{facture.numero_facture || facture.id}</td>
                  <td className="px-6 py-4">{facture.date ? new Date(facture.date).toLocaleDateString('fr-CA') : 'N/A'}</td>
                  <td className="px-6 py-4">{facture.montant_total ? `${facture.montant_total.toFixed(2)} $` : 'N/A'}</td>
                  <td className="px-6 py-4">
                    {facture.paye ? (
                      <span className="text-green-600 font-semibold">Payée</span>
                    ) : (
                      <span className="text-red-600 font-semibold">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {facture.lien_pdf ? (
                      <Link href={facture.lien_pdf} target="_blank" className="text-blue-600 hover:underline">
                        Voir PDF
                      </Link>
                    ) : (
                      'N/A'
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
