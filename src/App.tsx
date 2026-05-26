import React, { useState, useCallback } from 'react';
import { Product, CartItem, Transaction } from './types';
import { PRODUCTS } from './data/products';
import { Header, ProductSection, CartPanel, TransactionPanel } from './components/organisms';
import { ToastStack } from './components/atoms';
import type { ToastData } from './components/atoms';
import './styles/tokens.css';
import './App.css';

const App: React.FC = () => {
  const [cart,         setCart]         = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toasts,       setToasts]       = useState<ToastData[]>([]);

  /* ── Toast helpers ── */
  const pushToast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...data, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /* ── Cart handlers ── */
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;

    const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const transaction: Transaction = {
      id:           Date.now().toString(),
      items:        [...cart],
      total,
      timestamp:    new Date(),
      paymentMethod,
    };

    setTransactions(prev => [transaction, ...prev]);
    setCart([]);

    pushToast({
      type:     'success',
      message:  `Transaction complete!`,
      sub:      `$${total.toFixed(2)} paid by ${paymentMethod === 'cash' ? '💵 cash' : '💳 card'}`,
      duration: 4000,
    });
  };

  /* Called by CartPanel after user confirms via ConfirmBar — no window.confirm needed */
  const handleClearCart = () => {
    setCart([]);
    pushToast({ type: 'info', message: 'Cart cleared', duration: 2500 });
  };

  /* ── Render ── */
  return (
    <div className="app">
      <Header title="Point of Sale" />

      <div className="app__body">
        <main className="app__products">
          <ProductSection products={PRODUCTS} onAddToCart={handleAddToCart} />
        </main>

        <aside className="app__sidebar">
          <CartPanel
            items={cart}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
          />
          <TransactionPanel transactions={transactions} />
        </aside>
      </div>

      {/* Toast notifications — fixed overlay, no modal */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
