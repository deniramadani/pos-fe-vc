# POS-FE-VC

A fast, accessible **Point of Sale** system with a full **Back Office** — built with React, TypeScript, and an Atomic Design component architecture.

---

## Colour Palette

| Token | Hex | Role |
|---|---|---|
| `--c-navy` | `#003049` | Header, text, borders |
| `--c-orange` | `#F77F00` | Primary CTA, active tab, form focus |
| `--c-yellow` | `#FCBF49` | Cash badge, highlights, transaction totals |
| `--c-red` | `#D62828` | Danger actions, remove, delete |
| `--c-cream` | `#EAE2B7` | Page background |

---

## Features

### 🛒 POS (Point of Sale)
- **Product catalogue** — items grouped by category in a responsive grid
- **Cart management** — add, update quantities, remove items
- **Payment selector** — toggle between Cash and Card
- **Checkout** — completes the transaction and fires a Toast notification
- **Inline confirmation** — `ConfirmBar` replaces `window.confirm()` for clear-cart
- **Transaction history** — scrollable dark-panel log of every completed sale

### 🏢 Back Office
- **Dashboard** — 4 KPI cards (revenue, transactions, items sold, avg order), payment split bar, top-5 products by quantity, recent transactions table
- **Product management** — full CRUD with inline add/edit form and `ConfirmBar` delete confirmation; category datalist autocomplete
- **Transaction log** — search by product name or amount, filter by cash / card, expandable rows showing full item breakdown

### General
- 🔔 **Toast notifications** — slide-in alerts with auto-dismiss progress bar (no `alert()`)
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

### Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server with hot reload |
| `npm run build` | Production bundle |
| `npm test` | Jest test suite |

---

## Navigation

```
POS  ──[Back Office →]──▶  Back Office
                               ├── 📊 Dashboard
                               ├── 📦 Products
                               └── 🧾 Transactions
Back Office  ──[← Go to POS]──▶  POS
```

Product changes made in the Back Office are **immediately reflected** in the POS product grid. Deleting a product also removes it from any active cart.

---

## Project Structure

```
src/
├── styles/
│   └── tokens.css                   # CSS custom-property design tokens
│
├── components/
│   ├── atoms/                       # Smallest, no dependencies on other components
│   │   ├── Button                   # 5 variants (primary/secondary/danger/ghost/ghost-light) × 3 sizes
│   │   ├── Badge                    # Colour pill (navy/orange/yellow/red/cream)
│   │   ├── QuantityInput            # +/− stepper with min/max clamping
│   │   ├── Price                    # Formatted $ display — size + colour props
│   │   ├── Toast                    # Auto-dismissing notification with progress bar
│   │   ├── ToastStack               # Fixed overlay that stacks multiple toasts
│   │   └── index.ts
│   │
│   ├── molecules/                   # Atoms combined with a single purpose
│   │   ├── ProductCard              # Name + Price + add Button          [POS]
│   │   ├── CartItemRow              # Item + QuantityInput + total + remove  [POS]
│   │   ├── TransactionItem          # Timestamp + Badge + lines + total   [POS]
│   │   ├── PaymentSelector          # Cash / Card radio toggle            [POS]
│   │   ├── ConfirmBar               # Inline destructive-action confirmation [POS + BO]
│   │   ├── StatCard                 # KPI metric tile with coloured stripe [BO]
│   │   ├── ProductForm              # Add / edit form with validation      [BO]
│   │   ├── ProductRow               # Table row with edit / delete actions [BO]
│   │   ├── TransactionRow           # Expandable table row                 [BO]
│   │   └── index.ts
│   │
│   └── organisms/                   # Full UI sections composed from molecules
│       ├── Header                   # Brand bar + gradient stripe + action slot
│       ├── ProductSection           # Category headings + ProductCard grid  [POS]
│       ├── CartPanel                # Items + ConfirmBar + payment + checkout [POS]
│       ├── TransactionPanel         # Dark navy history sidebar panel       [POS]
│       ├── DashboardPanel           # KPIs + split + top products + recent  [BO]
│       ├── ProductManagerPanel      # CRUD table + inline form + confirm    [BO]
│       ├── TransactionLogPanel      # Search + filter + expandable table    [BO]
│       ├── BackOffice               # Back Office page with tab navigation  [BO]
│       └── index.ts
│
├── data/
│   └── products.ts                  # Seed product catalogue
│
├── types/
│   └── index.ts                     # Product, CartItem, Transaction interfaces
│
├── App.tsx                          # App-wide state + view routing (pos | backoffice)
├── App.css                          # Shell layout
└── index.tsx                        # Entry point
```

### Atomic Design contract

| Layer | Import rule | Owns state? |
|---|---|---|
| **Atom** | HTML + CSS only | No |
| **Molecule** | Atoms only | Minimal (UI only) |
| **Organism** | Molecules + atoms | Yes (section-level) |
| **App** | Organisms | Yes (app-wide) |

---

## UX Patterns

### ConfirmBar — inline, no modal

Used for both **Clear cart** (POS) and **Delete product** (Back Office):

```
🗑️  Remove all items from the cart?    [Keep]  [Yes, clear]
```

Slides in at the action point — no focus trap, no overlay, user never leaves context.

### Toast — auto-dismissing notification

Fires on checkout, product add/edit/delete, and cart clear:

```
┌──────────────────────────────────┐
│ ✅  Transaction complete!         │
│     $25.50 paid by 💵 cash       │ ×
│▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░│  ← progress bar
└──────────────────────────────────┘
```

Slides in from the top-right, auto-dismisses after 2.5–4 s, manually dismissable via ×.

### Expandable transaction rows (Back Office)

Click any row in the Transactions tab to reveal the full item breakdown inline — no separate page or modal needed.

---

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — end-to-end type safety
- **CSS custom properties** — single-source design tokens (`tokens.css`)
- **Atomic Design** — scalable, layered component hierarchy

## License

MIT
