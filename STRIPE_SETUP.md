# Stripe Integration Setup Guide

## 🔧 Environment Variables Required

Add these to your `.env` file in the root directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 📋 Setup Steps

### 1. Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_`)
4. Copy your **Publishable key** (starts with `pk_test_`)

### 2. Set Up Webhook Endpoint
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set URL to: `https://your-domain.com/api/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

### 3. Test the Integration
1. Use Stripe's test card numbers:
   - **Success**: `4242424242424242`
   - **Decline**: `4000000000000002`
   - **Requires authentication**: `4000002500003155`

## 🚀 Features Implemented

### ✅ Checkout Session Creation
- Automatic line item generation from cart
- Customer information pre-filling
- Discount code support (PRE25 = 20% off)
- Custom URL metadata handling
- Tax calculation integration

### ✅ Payment Processing
- Secure Stripe Checkout redirect
- Real-time payment status updates
- Order confirmation page
- Automatic cart clearing after success

### ✅ Webhook Handling
- Payment confirmation processing
- Order data logging
- Error handling and validation

### ✅ Success Page
- Order confirmation display
- Next steps information
- Action buttons for continued shopping

## 🔒 Security Features

- Environment variable protection
- Webhook signature verification
- Server-side payment processing
- No sensitive data in client-side code

## 💳 Supported Payment Methods

- Credit/Debit Cards (Visa, Mastercard, Amex, etc.)
- Apple Pay
- Google Pay
- Link by Stripe
- Bank redirects (for supported countries)

## 🌍 International Support

- Multiple currencies supported
- International shipping addresses
- Country-specific payment methods
- Tax calculation by region

## 📊 Order Data Structure

The system captures comprehensive order information:

```json
{
  "sessionId": "cs_stripe_session_id",
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "+1 (555) 123-4567"
  },
  "items": [
    {
      "title": "Premium T-Shirt",
      "size": "L",
      "color": "Black",
      "quality": "Premium",
      "customUrl": "https://example.com",
      "quantity": 2,
      "price": "$25.00"
    }
  ],
  "totals": {
    "subtotal": 50.00,
    "discount": 10.00,
    "discountCode": "PRE25",
    "tax": 3.20,
    "shipping": 0.00,
    "total": 43.20
  },
  "specialInstructions": "Please handle with care",
  "paymentStatus": "paid"
}
```

## 🛠 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run preview
```

## 🔄 Workflow

1. **Add to Cart** → Items stored in localStorage
2. **Checkout** → Form validation and data collection
3. **Payment** → Stripe session creation and redirect
4. **Processing** → Secure payment processing by Stripe
5. **Confirmation** → Webhook receives payment confirmation
6. **Success** → User redirected to success page
7. **Fulfillment** → Order processing and shipping

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing Stripe keys"** - Check your `.env` file
2. **Webhook errors** - Verify webhook URL and secret
3. **Payment failures** - Check Stripe Dashboard for logs
4. **Session expired** - Stripe sessions expire after 24 hours

### Debug Mode:
Check browser console and server logs for detailed error messages.

## 📞 Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For implementation issues:
- Check the browser developer console
- Review server logs
- Verify environment variables are set correctly 