import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { userSubscriptions } from '@/lib/db/schema';
import { db } from '@/lib/db';

import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

// Stripe will create a webhook by calling this endpoint once the checkout session is completed. 
// If failure it will retry again.

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers().get('Stripe-Signature')) as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    return new NextResponse('webhook error', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // new subscription created
  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    if (!session?.metadata?.userId) {
      return new NextResponse('no userId', { status: 400 }); // metadata being the userId
    }
    await db.insert(userSubscriptions).values({
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  return new NextResponse(null,{status: 200}); // stripe
}
