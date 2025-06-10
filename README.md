# Tremendous Tower - Premium T-Shirt Store

A modern, full-featured e-commerce website built with Astro, featuring custom QR code generation and Stripe payment integration.

## Features

- 🛍️ **Product Catalog** - Browse and view detailed product pages
- 🛒 **Shopping Cart** - Add items, manage quantities, and customize orders
- 🎨 **Product Customization** - Select sizes, colors, and quality options
- 🔗 **QR Code Generation** - Add custom URLs that get printed as QR codes on products
- 💳 **Stripe Integration** - Secure payment processing
- 📱 **Responsive Design** - Optimized for desktop and mobile
- 🌙 **Dark/Light Theme** - Toggle between themes
- ✨ **Modern UI** - Beautiful animations and transitions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   
   Edit the `.env` file and add your Stripe keys:
   ```env
   # Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
   STRIPE_PUBLIC_KEY=pk_test_your_actual_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Visit `http://localhost:4322`

## Stripe Setup

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Complete the account verification process

2. **Get Your API Keys**
   - Visit your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

3. **Update Environment Variables**
   - Replace the placeholder values in `.env` with your actual Stripe keys
   - **Important**: Keep your secret key private and never commit it to version control

4. **Test the Integration**
   - Add items to cart and proceed to checkout
   - Use Stripe's test card numbers:
     - Success: `4242 4242 4242 4242`
     - Declined: `4000 0000 0000 0002`
     - Use any future expiry date and any 3-digit CVC

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.astro    # Navigation bar
│   ├── Footer.astro    # Footer component
│   ├── ShoppingCart.astro # Shopping cart drawer
│   └── QRCodeGenerator.astro # QR code generation component
├── pages/              # Route pages
│   ├── product/        # Dynamic product pages
│   ├── checkout.astro  # Checkout form
│   ├── checkout/       
│   │   └── success.astro # Order success page
│   └── api/           # API endpoints
│       └── create-checkout-session.ts # Stripe checkout session
├── data/
│   └── products.js     # Product catalog data
└── styles/            # CSS styles
```

## Customization

### Adding Products
Edit `src/data/products.js` to add or modify products.

### Styling
The project uses Tailwind CSS with custom color variables defined in `src/styles/global.css`.

### Payment Processing
The Stripe integration is handled in `src/pages/api/create-checkout-session.ts`.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Support

For questions about Stripe integration, visit the [Stripe Documentation](https://docs.stripe.com/).

For Astro-specific questions, visit the [Astro Documentation](https://docs.astro.build/).
