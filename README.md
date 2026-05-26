# POS-FE-VC

A fast, accessible **Point of Sale** system with a full **Back Office** — built with React 18, TypeScript, and an Atomic Design component architecture. Connects to a REST backend for persistent data, with a local demo mode fallback when no backend is configured.

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
- **Cart management** — add, update quantities, remove items; live stock cap enforcement
- **Payment selector** — toggle between Cash and Card
- **Checkout** — completes the transaction, decrements stock, fires a Toast notification
- **Inline confirmation** — `ConfirmBar` replaces `window.confirm()` for clear-cart
- **Transaction history** — scrollable dark-panel log of every completed sale

### 🏢 Back Office (admin only)
- **Dashboard** — 4 KPI cards (revenue, transactions, items sold, avg order), payment split bar, top-5 products by quantity, recent transactions table
- **Product management** — full CRUD with inline add/edit form and `ConfirmBar` delete confirmation; category datalist autocomplete
- **Transaction log** — search by product name or amount, filter by cash / card, expandable rows showing full item breakdown
- **Goods movements** — record stock-in / stock-out events with product, quantity, date, and notes; full movement history table

### General
- 🔒 **Authentication** — email/password login, Google Sign-In (GIS), session persistence via JWT in `localStorage`
- 🔔 **Toast notifications** — slide-in alerts with auto-dismiss progress bar (no `alert()`)
- 📱 **Responsive** — single-column layout on mobile
- 🛡️ **Type-safe** — full TypeScript throughout
- 🔄 **Backend-optional** — works in local demo mode (`admin` / `admin`, `cashier` / `cashier`) when `REACT_APP_API_BASE_URL` is not set

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

---

## Configuration

Create a `.env` file in the project root (never commit this file):

```bash
# Required for backend-connected mode
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1

# Required for Google Sign-In
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> **Note:** CRA reads `.env` at server start. Restart `npm start` (or rebuild) after any change.

A `.env.example` template:

```bash
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_GOOGLE_CLIENT_ID=
```

---

## Backend API

The frontend connects to a REST backend at `REACT_APP_API_BASE_URL`. All routes are prefixed with `/api/v1`:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Email / password login |
| `POST` | `/auth/google` | Google ID-token login |
| `GET` | `/auth/me` | Verify stored token + fetch current user |
| `GET` | `/products` | List products (paginated) |
| `POST` | `/products` | Create product *(admin)* |
| `PUT` | `/products/:id` | Update product *(admin)* |
| `DELETE` | `/products/:id` | Soft-delete product *(admin)* |
| `GET` | `/transactions` | List transactions (paginated) |
| `POST` | `/transactions` | Checkout — create transaction |
| `GET` | `/goods-movements` | List goods movements (paginated) |
| `POST` | `/goods-movements` | Record stock-in / stock-out |

### Expected response envelope

```json
{
  "success": true,
  "message": "products retrieved",
  "data": [ ... ],
  "meta": { "page": 1, "limit": 100, "total_items": 5, "total_pages": 1 }
}
```

---

## Google Sign-In

1. Create a **Google OAuth 2.0 Client ID** (Web application) in the [Google Cloud Console](https://console.cloud.google.com/).
   - Add `http://localhost:3000` to **Authorized JavaScript origins** for local development.
2. Set `REACT_APP_GOOGLE_CLIENT_ID` in `.env` (see above).
3. Restart the dev server.

**Backend mode:** implement `POST /api/v1/auth/google` accepting `{ id_token }` and returning `{ token, user }` — the frontend forwards the Google ID token there for server-side verification.

**Demo mode (no backend):** the frontend parses the ID token client-side and signs the user in for UX purposes only — not a substitute for server-side verification in production.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server with hot reload at `localhost:3000` |
| `npm run build` | Optimised production bundle in `build/` |
| `npm test` | Jest test suite |

---

## Navigation

```
Login
 └── POS  ──[Back Office →]──▶  Back Office (admin only)
                                    ├── 📊 Dashboard
                                    ├── 📦 Products
                                    ├── 🧾 Transactions
                                    └── 📥 Goods Movements
     Back Office  ──[← Go to POS]──▶  POS
```

Product changes in the Back Office (CRUD + stock movements) are **immediately reflected** in the POS product grid. Deleting a product also removes it from any active cart.

---

## Project Structure

```
src/
├── styles/
│   └── tokens.css                   # CSS custom-property design tokens
│
├── components/
│   ├── atoms/                       # Smallest, no dependencies on other components
│   │   ├── Button                   # 5 variants × 3 sizes
│   │   ├── Badge                    # Colour pill (navy/orange/yellow/red/cream)
│   │   ├── QuantityInput            # +/− stepper with min/max clamping
│   │   ├── Price                    # Formatted currency display
│   │   ├── Toast                    # Auto-dismissing notification with progress bar
│   │   ├── ToastStack               # Fixed overlay that stacks multiple toasts
│   │   └── index.ts
│   │
│   ├── molecules/                   # Atoms combined with a single purpose
│   │   ├── ProductCard              # Name + Price + add Button             [POS]
│   │   ├── CartItemRow              # Item + QuantityInput + total + remove  [POS]
│   │   ├── TransactionItem          # Timestamp + Badge + lines + total      [POS]
│   │   ├── PaymentSelector          # Cash / Card radio toggle               [POS]
│   │   ├── ConfirmBar               # Inline destructive-action confirmation  [POS+BO]
│   │   ├── StatCard                 # KPI metric tile with coloured stripe    [BO]
│   │   ├── ProductForm              # Add / edit form with validation         [BO]
│   │   ├── ProductRow               # Table row with edit / delete actions    [BO]
│   │   ├── TransactionRow           # Expandable table row                    [BO]
│   │   ├── LoginForm                # Email/password + Google sign-in form
│   │   └── index.ts
│   │
│   └── organisms/                   # Full UI sections composed from molecules
│       ├── Header                   # Brand bar + gradient stripe + action slot
│       ├── ProductSection           # Category headings + ProductCard grid    [POS]
│       ├── CartPanel                # Items + ConfirmBar + payment + checkout [POS]
│       ├── TransactionPanel         # Dark navy history sidebar panel         [POS]
│       ├── DashboardPanel           # KPIs + split + top products + recent    [BO]
│       ├── ProductManagerPanel      # CRUD table + inline form + confirm      [BO]
│       ├── TransactionLogPanel      # Search + filter + expandable table      [BO]
│       ├── GoodsMovementPanel       # Stock-in/out form + movement history    [BO]
│       ├── BackOffice               # Back Office page with tab navigation    [BO]
│       ├── LoginPage                # Full-page login with Google Sign-In
│       └── index.ts
│
├── api.ts                           # All backend API calls + response parsing
├── types/
│   └── index.ts                     # Product, CartItem, Transaction, GoodsMovement interfaces
│
├── App.tsx                          # App-wide state, auth flow, view routing
├── App.css                          # Shell layout
└── index.tsx                        # Entry point (React 18 createRoot)
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

Used for **Clear cart** (POS) and **Delete product** (Back Office):

```
🗑️  Remove all items from the cart?    [Keep]  [Yes, clear]
```

Slides in at the action point — no focus trap, no overlay, user never leaves context.

### Toast — auto-dismissing notification

Fires on checkout, product add/edit/delete, stock movements, and errors:

```
┌──────────────────────────────────┐
│ ✅  Transaction complete!         │
│     $25.50 paid by 💵 cash       │ ×
│▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░│  ← progress bar
└──────────────────────────────────┘
```

Slides in from the top-right, auto-dismisses after 2.5–4 s, manually dismissable via ×. Uses `crypto.randomUUID()` for unique keys — safe even when multiple toasts fire simultaneously.

### Expandable transaction rows (Back Office)

Click any row in the Transactions tab to reveal the full item breakdown inline — no separate page or modal needed.

---

## Tech Stack

- **React 18** — UI framework with `createRoot`
- **TypeScript** — end-to-end type safety
- **CSS custom properties** — single-source design tokens (`tokens.css`)
- **Atomic Design** — scalable, layered component hierarchy
- **Google Identity Services (GIS)** — Google Sign-In

---

## License

MIT
