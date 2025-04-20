// /app/api/stripe/charge-factures/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const now = new Date();
  const mois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { data: factures, error } = await supabase
    .from('factures')
    .select('id, montant_total, parent_id')
    .eq('mois', mois)
    .eq('payee', false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const facture of factures || []) {
    // Récupérer le client Stripe
    const { data: parent } = await supabase
      .from('parents')
      .select('stripe_customer_id')
      .eq('id', facture.parent_id)
      .single();

    if (!parent?.stripe_customer_id) continue;

    try {
      await stripe.paymentIntents.create({
        amount: Math.round(facture.montant_total * 100), // en centimes
        currency: 'cad',
        customer: parent.stripe_customer_id,
        confirm: true,
        automatic_payment_methods: { enabled: true },
        description: `Facture d'avril (mois ${mois}) Horizon Scolaire`,
        metadata: { facture_id: facture.id },
      });

      // Marquer la facture comme payée
      await supabase
        .from('factures')
        .update({ payee: true })
        .eq('id', facture.id);
    } catch (err: any) {
      console.error(`[Paiement échoué] Facture ${facture.id}:`, err.message);
    }
  }

  return NextResponse.json({ success: true });
}
