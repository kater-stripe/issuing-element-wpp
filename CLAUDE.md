# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Stripe Issuing Elements demo application that displays a virtual card with secure card details (number, expiry, CVC, PIN) and an "Add to Wallet" button for Apple/Google Pay integration. The project uses Stripe.js v3 and demonstrates Stripe Issuing Elements API v2 with beta features.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (opens browser automatically)
npm start

# Build for production
npm build
```

The app uses Parcel bundler and serves on a local dev server via `npm start`. Port can be configured in package.json with `--port` flag.

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_ACCOUNT=acct_...
CARD_ID=ic_...
```

Parcel automatically injects these variables via `process.env` at build time. The application accesses them in `src/index.js` lines 7-10.

## Architecture

### Entry Point
- `index.html` - Main HTML file that loads Stripe.js from CDN and bootstraps the app
- `src/index.js` - Main JavaScript file containing two primary functions:
  - `renderCard()` (line 56) - Renders card display elements (number, expiry, CVC, PIN)
  - `renderWalletButton()` (line 135) - Renders "Add to Wallet" button (requires beta access)

### Stripe Integration

The app demonstrates two separate Stripe instances:
1. **GA Elements** (`renderCard()` at line 56) - Uses generally available Stripe Elements for card display
2. **Beta Elements** (`renderWalletButton()` at line 135) - Uses beta Stripe instance with `issuing_add_to_wallet_button_element_1` and `issuing_elements_2` betas enabled

**Key Flow:**
1. Create ephemeral key nonce via `stripe.createEphemeralKeyNonce()`
2. Exchange nonce for ephemeral key via `getEphemeralKey()` (src/index.js:22)
3. Create Stripe Elements with the ephemeral key secret
4. Mount elements to DOM

### API Calls

**Important:** The app includes API credentials exposed in the client and makes direct API calls from the client for demo purposes. Lines 22-38 and 40-54 contain server-side logic that should normally live on a backend server:

- `getEphemeralKey()` (line 22) - Fetches ephemeral keys from Stripe API (should be server-side)
- `getIssuingCard()` (line 40) - Retrieves card and cardholder details (should be server-side)

Both functions use `STRIPE_SECRET_KEY` which is a security anti-pattern for production.

### Stripe Elements Created

From the GA Stripe instance (src/index.js:100-123):
- `issuingCardNumberDisplay` - Displays full card number
- `issuingCardExpiryDisplay` - Displays expiration date
- `issuingCardCvcDisplay` - Displays CVC/CVV
- `issuingCardPinDisplay` - Displays PIN

From the Beta Stripe instance (src/index.js:168-171):
- `issuingAddToWalletButton` - Apple/Google Pay provisioning button

### Styling
- `src/index.css` - Contains card layout styling with absolute positioning over a background image
- Card background image: `public/card-back.png` (384px × 244px)
- Element styling passed via `STYLE` constant (src/index.js:12-18)
- Custom fonts can be loaded via Elements API (currently references `src/fonts.css`)

## Key Technical Details

- **Mixed Stripe versions:** Uses both GA and beta Stripe instances, which cannot share elements
- **Beta dependency:** Wallet button requires beta flag access from Stripe
- **Stripe API versions:**
  - Card retrieval: `2025-06-30.basil`

## Security Notes

This is a demo application with intentional security anti-patterns for demonstration purposes:
- Secret keys are exposed client-side
- API calls that should be server-side are made from the browser
- In production, ephemeral key generation and card retrieval must be handled server-side

## Additional Notes

- The wallet button only works with real PAN (requires livemode card)
- Wallet button element events: `click`, `success`, `error` (see src/index.js:174-184)
