import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const { data: factures, error } = await supabase
      .from('factures')
      .select('id, parent_id, montant_total')
      .eq('payee', false);

    if (error) throw error;

    const now = new Date();

    for (const facture of factures) {
      const { data: parent, error: errParent } = await supabase
        .from('parents')
        .select('stripe_customer_id')
        .eq('id', facture.parent_id)
        .single();

      if (errParent || !parent?.stripe_customer_id) {
        console.warn(`[Stripe] Aucune carte pour parent ${facture.parent_id}`);
        continue;
      }

      // 🔍 Récupérer la source par défaut (la carte) du client Stripe
      const customer = await stripe.customers.retrieve(parent.stripe_customer_id);
      if (!customer || typeof customer === 'string') continue;

      const defaultSource = customer.invoice_settings?.default_payment_method || customer.default_source;

      if (!defaultSource) {
        console.warn(`[Stripe] Aucun moyen de paiement par défaut pour ${facture.parent_id}`);
        continue;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        customer: parent.stripe_customer_id,
        amount: Math.round(facture.montant_total * 100),
        currency: 'cad',
        payment_method: typeof defaultSource === 'string' ? defaultSource : undefined,
        off_session: true,
        confirm: true,
        description: `Paiement facture #${facture.id} - ${now.toLocaleDateString('fr-CA')}`,
      });

      if (paymentIntent.status === 'succeeded') {
        await supabase
          .from('factures')
          .update({ payee: true, date_paiement: now.toISOString() })
          .eq('id', facture.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API] Erreur chargement Stripe:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
