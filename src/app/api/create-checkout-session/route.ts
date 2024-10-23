import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-09-30.acacia',
});


console.log("/////// STRIPE_SECRET_KEY ////////",process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  try {
    const { amount, customer, metadata } = await request.json();
    
    // Create a new Stripe customer
    const stripeCustomer = await stripe.customers.create({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${metadata.service.charAt(0).toUpperCase()}${metadata.service.slice(1)} service`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
      customer: stripeCustomer.id, // Use the newly created customer
      metadata: metadata,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
