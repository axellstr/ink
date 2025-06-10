import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }
    
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Payment was successful
      console.log('Payment successful for session:', session.id);
      
      // Here you would typically:
      // 1. Save the order to your database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Generate QR codes for custom URLs
      
      await handleSuccessfulPayment(session);
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent was successful:', paymentIntent.id);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent failed:', paymentIntent.id);
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // Retrieve the session with line items
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ['line_items', 'customer'] }
    );

    const orderData = {
      sessionId: session.id,
      customerEmail: session.customer_email,
      customerName: session.metadata?.customerName,
      customerPhone: session.metadata?.customerPhone,
      specialInstructions: session.metadata?.specialInstructions,
      totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      paymentStatus: session.payment_status,
      items: sessionWithLineItems.line_items?.data || [],
      discountCode: session.metadata?.discountCode,
      createdAt: new Date(),
    };

    // Log the order (in production, save to database)
    console.log('Order completed:', orderData);
    
    // TODO: Implement these functions based on your needs:
    // await saveOrderToDatabase(orderData);
    // await sendConfirmationEmail(orderData);
    // await updateInventory(orderData.items);
    // await generateQRCodes(orderData);
    
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
} 