import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if Stripe secret key is available
    const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey || stripeSecretKey.includes('your_secret_key_here')) {
      return new Response(
        JSON.stringify({ 
          error: 'Stripe secret key not configured properly. Please check your .env file.',
          details: 'STRIPE_SECRET_KEY environment variable is missing or contains placeholder value.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe with your secret key from environment variables
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil',
    });

    const body = await request.json();
    const { items, customer, billing, shipping, totals, discountCode } = body;

    // Validate required data
    if (!items || !customer || !totals) {
      return new Response(
        JSON.stringify({ error: 'Missing required checkout data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use the exact total from checkout page instead of individual line items
    // This ensures discounts and calculations are exactly as shown to customer
    const totalAmount = Math.round(totals.total * 100); // Convert to cents
    
    // Create a single line item for the total order
    const lineItems = [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Order Total (${items.length} item${items.length > 1 ? 's' : ''})`,
          description: items.map((item: any) => {
            let itemDesc = `${item.title} (Size: ${item.size || 'L'}, Color: ${item.color || 'Black'}, Quality: ${item.quality || 'Premium'})`;
            if (item.customUrl && item.customUrl.trim()) {
              itemDesc += `\n🔗 Custom QR URL: ${item.customUrl}`;
            }
            return itemDesc;
          }).join('\n\n'),
          metadata: {
            orderType: 'complete_order',
            itemCount: items.length.toString(),
            subtotal: totals.subtotal.toString(),
            discount: totals.discount.toString(),
            discountCode: totals.discountCode || '',
          },
        },
        unit_amount: totalAmount,
      },
      quantity: 1,
    }];

    // Note: Discounts are handled on the checkout page, not in Stripe
    // The total amount passed already includes any discounts applied

    // Create a customer in Stripe with pre-filled information
    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
      phone: customer.phone,
      address: {
        line1: billing.address,
        city: billing.city,
        state: billing.state,
        postal_code: billing.zip,
        country: billing.country,
      },
      shipping: {
        name: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone,
        address: {
          line1: shipping.address,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.zip,
          country: shipping.country,
        },
      },
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      
      // Use the pre-created customer
      customer: stripeCustomer.id,
      
      // Disable address collection since we already have it
      billing_address_collection: 'auto', // Only collect if needed for payment method
      
      // Success and cancel URLs
      success_url: `${new URL(request.url).origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/checkout`,
      
      // Metadata for order tracking
      metadata: {
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        billingAddress: `${billing.address}, ${billing.city}, ${billing.state} ${billing.zip}, ${billing.country}`,
        shippingAddress: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`,
        specialInstructions: body.specialInstructions || '',
        orderTotal: totals.total.toString(),
        subtotal: totals.subtotal.toString(),
        discountCode: discountCode || '',
        discountAmount: totals.discount?.toString() || '0',
        // Add custom URLs from all items
        customUrls: JSON.stringify(items.filter((item: any) => item.customUrl).map((item: any) => ({
          productId: item.id,
          productTitle: item.title,
          customUrl: item.customUrl
        }))),
      },
      
      // Additional options
      automatic_tax: {
        enabled: false, // We're handling tax calculation ourselves
      },
      
      // Note: Special instructions are stored in metadata instead of custom fields
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to create checkout session';
    let errorDetails = 'Unknown error';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Check for common Stripe errors
      if (error.message.includes('Invalid API Key')) {
        errorMessage = 'Invalid Stripe API key';
        errorDetails = 'Please check that your STRIPE_SECRET_KEY in the .env file is correct and starts with sk_test_ or sk_live_';
      } else if (error.message.includes('No such')) {
        errorMessage = 'Stripe resource not found';
      } else if (error.message.includes('rate_limit')) {
        errorMessage = 'Too many requests to Stripe API';
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}; 