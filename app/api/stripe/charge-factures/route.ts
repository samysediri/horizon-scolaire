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
      const { data: parent } = await supabase
        .from('parents')
        .select('stripe_customer_id')
        .eq('id', facture.parent_id)
        .single();

      if (!parent?.stripe_customer_id) {
        console.warn(`[Stripe] Aucune carte enregistrée pour le parent ${facture.parent_id}`);
        continue;
      }

      const customer = await stripe.customers.retrieve(parent.stripe_customer_id) as Stripe.Customer;

      const defaultSourceId =
        typeof customer.invoice_settings?.default_payment_method === 'string'
          ? customer.invoice_settings.default_payment_method
          : typeof customer.default_source === 'string'
          ? customer.default_source
          : null;

      if (!defaultSourceId) {
        console.warn(`[Stripe] Aucun moyen de paiement par défaut pour ${facture.parent_id}`);
        continue;
      }

      const montantCents = Math.round(facture.montant_total * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        customer: parent.stripe_customer_id,
        amount: montantCents,
        currency: 'cad',
        payment_method: defaultSourceId,
        confirm: true,
        description: `Paiement facture #${facture.id} - ${now.toLocaleDateString('fr-CA')}`,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        }
      });

      if (paymentIntent.status === 'succeeded') {
        const { error: updateError, data: updateData } = await supabase
          .from('factures')
          .update({ payee: true, date_paiement: now.toISOString() })
          .eq('id', facture.id);

        if (updateError) {
          console.error('[SUPABASE] Erreur lors de la mise à jour de la facture:', updateError);
        } else {
          console.log('[SUPABASE] Mise à jour réussie:', updateData);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API] Erreur chargement Stripe:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
