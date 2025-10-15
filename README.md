# FinanceHub - Stripe Issuing Elements Demo

A modern financial dashboard showcasing Stripe Issuing Elements with secure virtual card display, Apple/Google Pay wallet integration, and a professional card management interface. This project demonstrates the Stripe Issuing Elements API v2 with beta features.

## Features

- **Modern Dashboard UI**: Professional finance dashboard with sidebar navigation and responsive layout
- **Virtual Card Display**: Securely display card details (number, expiry, CVC, PIN) using Stripe Issuing Elements
- **Card Management**: Real-time card status, available balance display, and action buttons (Freeze Card, Report Lost)
- **Recent Activity**: Transaction history display with merchant icons and timestamps
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

- **`index.html`** - Main HTML entry point with full dashboard layout including:
  - Sidebar navigation with FinanceHub branding
  - Card status badge and available balance display
  - Virtual card display with Stripe Elements
  - Action buttons (Freeze Card, Report Lost)
  - Recent Activity section with transaction history
  - Loads Stripe.js v3 from CDN
- **`src/index.js`** - Core application logic with two primary functions:
  - `renderCard()` (line 58) - Renders card display elements using GA Stripe instance
  - `renderWalletButton()` (line 165) - Renders "Add to Wallet" button using Beta Stripe instance
- **`src/index.css`** - Modern CSS with design system including:
  - CSS custom properties (design tokens)
  - Dashboard layout with flexbox
  - Sidebar styling with navigation states
  - Card container with shadows and rounded borders
  - Activity section and transaction item styles
  - Responsive breakpoints for mobile
- **`public/card-back.png`** - Card background image (384px × 244px)
- **`src/fonts.css`** - Custom font definitions for Elements styling

### UI Components

- **Sidebar Navigation**: Fixed left sidebar with navigation items and user profile
- **Card Status Badge**: Green "Card Active" indicator with dot icon
- **Balance Display**: Large available balance amount ($1,284.52)
- **Virtual Card**: Stripe Issuing card with secure element mounting
- **Action Buttons**: Rounded buttons for card management actions
- **Add to Wallet**: Full-width button for Apple/Google Pay provisioning
- **Recent Activity**: Card-style container showing transaction history

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
- **Modern CSS** - CSS custom properties with OKLCH color space
- **Lucide Icons** - SVG icons for navigation and UI elements
- **Environment Variables** - Injected at build time via Parcel

## Design System

The application uses a modern design system with:
- **Color Palette**: OKLCH color space for precise color management
- **Typography**: System font stack for optimal performance
- **Spacing**: Consistent 4px/8px grid system
- **Border Radius**: Variable radius (10px base) for UI elements
- **Shadows**: Layered shadows for depth and visual hierarchy
- **Responsive**: Mobile-first approach with breakpoints at 768px

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
"start": "parcel index.html --port 8080"
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
