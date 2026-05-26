# Point of Sale (POS) System

A simple Point of Sale system built with React and TypeScript.

## Features

✅ **Product Management** - Browse products organized by category  
✅ **Shopping Cart** - Add, remove, and modify quantities  
✅ **Payment Methods** - Support for cash and card payments  
✅ **Transaction History** - View completed transactions  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Type-Safe** - Full TypeScript support  

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite

## Project Structure

```
src/
├── components/          # React components
│   ├── ProductList.tsx
│   ├── Cart.tsx
│   └── TransactionHistory.tsx
├── data/               # Mock data
│   └── products.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── App.tsx             # Main app component
├── App.css             # Main styles
└── index.tsx           # Entry point
```

## Usage

1. **Browse Products** - Products are organized by category (Beverages, Food, Pastries)
2. **Add to Cart** - Click "Add to Cart" button on any product
3. **Manage Cart** - Adjust quantities, remove items, or clear the entire cart
4. **Select Payment** - Choose between Cash or Card payment methods
5. **Checkout** - Complete the transaction and view it in the transaction history

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Styling with responsive design

## License

MIT