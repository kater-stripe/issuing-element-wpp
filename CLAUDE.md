# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Stripe Issuing Elements demo application featuring a professional finance dashboard interface. It displays a virtual card with secure card details (number, expiry, CVC, PIN), an "Add to Wallet" button for Apple/Google Pay integration, and a modern UI with sidebar navigation, balance display, action buttons, and recent transaction history. Built with Stripe.js v3 and demonstrates Stripe Issuing Elements API v2 with beta features.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (opens browser automatically at port 8080)
npm start

# Build for production
npm build
```

The app uses Parcel bundler and serves on port 8080 by default. If port 8080 is unavailable, Parcel will automatically select an alternative port.

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

### UI Structure

The application features a professional finance dashboard layout with:

**Dashboard Layout** (`index.html`):
- **Sidebar Navigation** (lines 14-92): Full-height sidebar with FinanceHub branding, navigation menu (Dashboard, Card Management, Transactions, Accounts, Customers, Analytics, Settings), and user profile footer
- **Main Content Area** (lines 95-214): Header with page title/subtitle, and scrollable content area
- **Card Display Section** (lines 106-143): Status badge, available balance ($1,284.52), virtual card with Stripe Elements, and action buttons
- **Recent Activity** (lines 171-213): Transaction history with merchant icons, timestamps, and amounts

**Key UI Components**:
- Card status badge showing "Card Active" with green indicator
- Available balance display above the card
- Action buttons: "Freeze Card" and "Report Lost" (pill-shaped with rounded borders)
- Apple Wallet integration button (centered, full-width)
- Recent Activity card showing transactions (Uber -$35.50, Starbucks -$6.75)

### Stripe Integration

The app uses two separate Stripe instances due to beta limitations:

1. **GA Elements** (`renderCard()` at src/index.js:54) - Generally available Stripe Elements for card display
2. **Beta Elements** (`renderWalletButton()` at src/index.js:133) - Beta Stripe instance with `issuing_add_to_wallet_button_element_1` and `issuing_elements_2` betas enabled

**Critical Implementation Detail**: GA elements and beta elements cannot share the same Stripe instance, requiring two separate instances to be initialized.

**Ephemeral Key Flow**:
1. Create ephemeral key nonce via `stripe.createEphemeralKeyNonce({ issuingCard: CARD_ID })`
2. Exchange nonce for ephemeral key via `getEphemeralKey()` (src/index.js:22)
3. Create Stripe Elements with `ephemeralKeySecret` from the response
4. Mount elements to their respective DOM containers

### Stripe Elements Created

**From GA Stripe Instance** (src/index.js:98-127):
- `issuingCardNumberDisplay` - Mounted to `#card-number`
- `issuingCardExpiryDisplay` - Mounted to `#card-expiry`
- `issuingCardCvcDisplay` - Mounted to `#card-cvc`
- `issuingCardPinDisplay` - Mounted to `#card-pin`
- Cardholder name is fetched from API and set as text content (not a Stripe Element)

**From Beta Stripe Instance** (src/index.js:166-184):
- `issuingAddToWalletButton` - Mounted to `#add-to-wallet-button`, handles Apple/Google Pay provisioning

### API Calls (Client-Side Demo Pattern)

**Important:** This demo includes server-side API calls executed client-side for demonstration purposes:

- `getEphemeralKey(nonce)` (line 22) - Exchanges nonce for ephemeral key using Stripe API
- `getIssuingCard(CARD_ID)` (line 38) - Retrieves card and cardholder details from Stripe API

Both functions use `STRIPE_SECRET_KEY` directly in the browser, which is a security anti-pattern acceptable only for demos. **In production, these must be server-side endpoints.**

### Design System and Styling

**CSS Architecture** (`src/index.css`):

**Design Tokens** (lines 2-19): CSS custom properties using OKLCH color space for consistent theming
- `--background`, `--foreground`, `--card`, `--primary`, etc.
- Sidebar-specific tokens: `--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-border`

**Layout Structure**:
- Dashboard: Full-height flex layout with sidebar + main content
- Sidebar: Fixed 256px width with sticky positioning
- Main content: Flexbox column with header (64px) and scrollable content area
- Card container: Centered flex layout with max-width 600px

**Component Styling**:
- Card display: 384px × 244px with `border-radius: 12px` and professional shadow
- Action buttons: Pill-shaped with `border-radius: 24px`
- Activity section: Card-style container with `border-radius: 16px`
- Status badge: Green with `background-color: #ecfdf5` and `color: #059669`
- Activity icons: Colored circular backgrounds (Uber: purple, Starbucks: yellow)

**Responsive Design** (lines 486-507): Mobile breakpoint at 768px hides sidebar and adjusts card size

### File Structure

- `index.html` - Dashboard layout, sidebar navigation, card UI, and activity section
- `src/index.js` - Stripe integration logic, ephemeral key handling, element mounting
- `src/index.css` - Design system variables, dashboard layout, component styling
- `public/card-back.png` - Virtual card background image (384px × 244px)
- `src/fonts.css` - Custom font definitions for Stripe Elements

## Key Technical Details

- **Mixed Stripe instances required:** GA and beta Stripe instances cannot share elements
- **Beta access needed:** Wallet button requires beta flags from Stripe
- **Stripe API version:** `2025-06-30.basil`
- **Wallet compatibility:** Only works with live mode cards (requires real PAN)
- **Element styling:** Passed via `STYLE` constant (white text, 14px, 24px line-height)
- **Environment variable injection:** Parcel injects at build time via `process.env`

## Security Notes

This is a demo application with intentional security anti-patterns for demonstration purposes:
- Secret keys are exposed client-side in `src/index.js`
- Ephemeral key generation happens in browser instead of server
- Card retrieval API calls made directly from client
- **In production:** Move all API calls to secure backend endpoints, never expose `STRIPE_SECRET_KEY`, implement proper authentication

## UI Customization Guidelines

When modifying the UI:
- Maintain the design token system in CSS variables for consistency
- Keep sidebar width at 256px for optimal layout balance
- Action buttons should use `border-radius: 24px` for pill shape
- Activity section and cards should use `border-radius: 16px`
- Use OKLCH color space for new color values to match existing palette
- Balance amount font size is 36px (reduced from original 48px for better proportion)
- Ensure all interactive elements have hover states defined
