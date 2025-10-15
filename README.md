# Stripe Issuing Elements Demo

A demonstration application showcasing Stripe Issuing Elements with secure virtual card display and Apple/Google Pay wallet integration. This project demonstrates the Stripe Issuing Elements API v2 with beta features.

## Features

- **Virtual Card Display**: Securely display card details (number, expiry, CVC, PIN) using Stripe Issuing Elements
- **Wallet Provisioning**: "Add to Wallet" button for Apple Pay and Google Pay integration
- **Ephemeral Keys**: Secure card data handling using Stripe's ephemeral key authentication
- **Modern Stack**: Built with Stripe.js v3, Parcel bundler, and vanilla JavaScript

## Prerequisites

- Node.js and npm installed
- Stripe account with Issuing enabled
- A live mode issuing card (required for wallet provisioning - test cards don't work with real PAN)
- Beta access to the following Stripe features:
  - `issuing_add_to_wallet_button_element_1`
  - `issuing_elements_2`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:

Create a `.env` file in the root directory with your Stripe credentials:

```env
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_ACCOUNT=acct_...
CARD_ID=ic_...
```

**Security Note:** This demo includes client-side API calls for demonstration purposes only. In production, ephemeral key generation and card retrieval should be handled server-side.

## Development

Start the development server:
```bash
npm start
```

The application will open automatically in your browser. By default, Parcel serves on port 1234, but will use an available port if 1234 is in use.

## Build

Build for production:
```bash
npm build
```

## Architecture

### File Structure

- **`index.html`** - Main HTML entry point, loads Stripe.js v3 from CDN and bootstraps the application
- **`src/index.js`** - Core application logic with two primary functions:
  - `renderCard()` (line 58) - Renders card display elements using GA Stripe instance
  - `renderWalletButton()` (line 165) - Renders "Add to Wallet" button using Beta Stripe instance
- **`src/index.css`** - Card layout and styling with absolute positioning over background image
- **`public/card-back.png`** - Card background image (384px × 244px)
- **`src/fonts.css`** - Custom font definitions for Elements styling

### Stripe Integration Flow

1. **Create Ephemeral Key Nonce**: Call `stripe.createEphemeralKeyNonce()` client-side
2. **Exchange for Ephemeral Key**: Send nonce to backend (or demo API) via `getEphemeralKey()` (line 26)
3. **Initialize Elements**: Create Stripe Elements instance with ephemeral key secret
4. **Mount Elements**: Attach elements to DOM containers

### Stripe Elements

**GA Stripe Instance** (lines 102-125):
- `issuingCardNumberDisplay` - Full card number display
- `issuingCardExpiryDisplay` - Expiration date display
- `issuingCardCvcDisplay` - CVC/CVV display
- `issuingCardPinDisplay` - PIN display

**Beta Stripe Instance** (lines 198-201):
- `issuingAddToWalletButton` - Apple/Google Pay provisioning button

### API Calls

The demo includes two server-side functions implemented client-side for demonstration purposes:

- **`getEphemeralKey()`** (lines 26-40) - Fetches ephemeral keys from Stripe API
- **`getIssuingCard()`** (lines 42-56) - Retrieves card and cardholder details

Both use `STRIPE_SECRET_KEY` directly in the browser, which is acceptable for demos but **must be moved server-side for production**.

## Technology Stack

- **Stripe.js v3** - Official Stripe JavaScript library
- **Stripe Issuing Elements API v2** - With beta features enabled
- **Parcel** - Zero-config bundler with hot module replacement
- **Vanilla JavaScript** - No framework dependencies
- **Environment Variables** - Injected at build time via Parcel

## Important Notes

### Mixed Stripe Instances
This demo uses **two separate Stripe instances** because:
- GA (Generally Available) elements don't work with beta flags
- Beta elements are required for the wallet button
- Elements cannot be shared between different Stripe instances

### Production Considerations
- The wallet button requires beta access from Stripe
- Wallet provisioning only works with **live mode cards** (test cards don't support real PAN)
- Stripe API version used: `2025-06-30.basil`
- Environment variables are injected at build time (accessible via `process.env`)

### Port Configuration
The development server uses Parcel's default port selection. To specify a custom port, modify the `start` script in `package.json`:
```json
"start": "parcel index.html --port 3000"
```

## Security Warning

⚠️ **This is a demo application with intentional security anti-patterns for demonstration purposes:**

- Secret keys are exposed client-side
- API calls that should be server-side are made from the browser
- No authentication or authorization is implemented

**In production:**
- Move ephemeral key generation to a secure backend endpoint
- Move card retrieval logic to a secure backend endpoint
- Never expose `STRIPE_SECRET_KEY` in client-side code
- Implement proper authentication and authorization
- Use environment variables only on the server

## License

This is a demonstration application for educational purposes.
