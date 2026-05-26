# Point of Sale (POS) System

A fast, accessible Point of Sale system built with **React**, **TypeScript**, and an **Atomic Design** component architecture.

---

## Preview

| Area | Colour |
|---|---|
| Header / nav | `#003049` Navy |
| Primary actions | `#F77F00` Orange |
| Highlights / cash badge | `#FCBF49` Yellow |
| Danger / remove | `#D62828` Red |
| Page background | `#EAE2B7` Cream |

---

## Features

- 🛍️ **Product catalogue** — items grouped by category in a responsive grid
- 🛒 **Cart management** — add, update quantities, remove items
- 💳 **Payment selector** — toggle between Cash and Card
- ✅ **Inline confirmation** — `ConfirmBar` replaces `window.confirm()` for clear-cart
- 🔔 **Toast notifications** — auto-dismissing slide-in alerts replace `alert()` for checkout success
- 📋 **Transaction history** — scrollable log of every completed sale
- 📱 **Responsive** — single-column layout on mobile
- 🔒 **Type-safe** — full TypeScript, zero `any`

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm

### Install & run

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

### Other scripts

| Command | Description |
|---|---|
| `npm start` | Dev server with hot reload |
| `npm run build` | Production bundle |
| `npm test` | Jest test suite |

---

## Project Structure

```
src/
├── styles/
│   └── tokens.css              # CSS custom-property design tokens (colours, spacing, …)
│
├── components/
│   ├── atoms/                  # Smallest, self-contained building blocks
│   │   ├── Button              # 4 variants × 3 sizes
│   │   ├── Badge               # Colour pill label
│   │   ├── QuantityInput       # +/− stepper
│   │   ├── Price               # Formatted currency display
│   │   ├── Toast               # Auto-dismissing notification
│   │   ├── ToastStack          # Fixed overlay that stacks toasts
│   │   └── index.ts
│   │
│   ├── molecules/              # Atoms combined with a single purpose
│   │   ├── ProductCard         # Name + Price + add Button
│   │   ├── CartItemRow         # Item info + QuantityInput + line total + remove
│   │   ├── TransactionItem     # Timestamp + Badge + line items + total
│   │   ├── PaymentSelector     # Cash / Card radio toggle
│   │   ├── ConfirmBar          # Inline destructive-action confirmation
│   │   └── index.ts
│   │
│   └── organisms/              # Full UI sections composed from molecules
│       ├── Header              # Brand bar with gradient accent stripe
│       ├── ProductSection      # Category headings + ProductCard grid
│       ├── CartPanel           # Item list + ConfirmBar + payment + checkout
│       ├── TransactionPanel    # Dark navy history panel
│       └── index.ts
│
├── data/
│   └── products.ts             # Mock product catalogue
│
├── types/
│   └── index.ts                # Product, CartItem, Transaction interfaces
│
├── App.tsx                     # State logic + layout composition
├── App.css                     # Shell layout (uses token variables)
└── index.tsx                   # Entry point
```

### Atomic Design layers

| Layer | Rule |
|---|---|
| **Atom** | No imports from other components; only HTML + CSS |
| **Molecule** | Imports atoms only |
| **Organism** | Imports molecules (and atoms); owns section-level state |
| **App** | Imports organisms; owns app-wide state |

---

## UX patterns

### ConfirmBar — inline, no modal

Clicking **Clear** inside the cart replaces the action buttons with an inline banner:

```
🗑️  Remove all items from the cart?    [Keep]  [Yes, clear]
```

No focus trap, no page overlay — the user stays in context.

### Toast — auto-dismissing notification

After checkout a slide-in toast appears in the top-right corner:

```
┌──────────────────────────────────┐
│ ✅  Transaction complete!         │
│     $25.50 paid by 💵 cash       │ ×
│▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░│  ← progress bar
└──────────────────────────────────┘
```

Auto-dismisses after 4 s; manually dismissable via ×.

---

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — end-to-end type safety
- **CSS custom properties** — single-source design tokens
- **Atomic Design** — scalable component hierarchy

## License

MIT
