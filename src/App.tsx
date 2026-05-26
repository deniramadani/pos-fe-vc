import React, { useState, useCallback } from 'react';
import { Product, CartItem, Transaction, User } from './types';
import { PRODUCTS } from './data/products';
import {
  Header,
  ProductSection,
  CartPanel,
  TransactionPanel,
  BackOffice,
  LoginPage,
} from './components/organisms';
import { ToastStack, Button, Badge } from './components/atoms';
import type { ToastData } from './components/atoms';
import './styles/tokens.css';
import './App.css';

/* ── Mock credential store ─────────────────────────────── */
const USERS: Array<{ username: string; password: string; role: User['role'] }> = [
  { username: 'admin',   password: 'admin',   role: 'admin' },
  { username: 'cashier', password: 'cashier', role: 'cashier' },
];

type AppView = 'pos' | 'backoffice';

const App: React.FC = () => {
  /* ── Auth ── */
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string, password: string): boolean => {
    const match = USERS.find(
      u => u.username === username && u.password === password
    );
    if (match) {
      setCurrentUser({ username: match.username, role: match.role });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('pos');
    setCart([]);
  };

  /* ── View ── */
  const [view, setView] = useState<AppView>('pos');

  /* ── POS state ── */
  const [products,     setProducts]     = useState<Product[]>(PRODUCTS);
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

  /* ── Product CRUD ── */
  const handleAddProduct = (data: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...data, id: Date.now().toString() }]);
    pushToast({ type: 'success', message: `"${data.name}" added`, duration: 2500 });
  };

  const handleUpdateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    pushToast({ type: 'success', message: `"${product.name}" updated`, duration: 2500 });
  };

  const handleDeleteProduct = (productId: string) => {
    const name = products.find(p => p.id === productId)?.name ?? 'Product';
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(i => i.product.id !== productId));
    pushToast({ type: 'info', message: `"${name}" deleted`, duration: 2500 });
  };

  /* ── Cart handlers ── */
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing)
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) =>
    setCart(prev => prev.filter(i => i.product.id !== productId));

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { handleRemoveFromCart(productId); return; }
    setCart(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;
    const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    setTransactions(prev => [
      {
        id: Date.now().toString(),
        items: [...cart],
        total,
        timestamp: new Date(),
        paymentMethod,
      },
      ...prev,
    ]);
    setCart([]);
    pushToast({
      type:     'success',
      message:  'Transaction complete!',
      sub:      `$${total.toFixed(2)} paid by ${paymentMethod === 'cash' ? '💵 cash' : '💳 card'}`,
      duration: 4000,
    });
  };

  const handleClearCart = () => {
    setCart([]);
    pushToast({ type: 'info', message: 'Cart cleared', duration: 2500 });
  };

  /* ── Shared header action slots ── */
  const userChip = currentUser && (
    <div className="app__user-chip">
      <Badge variant={currentUser.role === 'admin' ? 'orange' : 'navy'}>
        {currentUser.role}
      </Badge>
      <span className="app__username">{currentUser.username}</span>
      <button className="app__logout-btn" onClick={handleLogout} type="button" title="Sign out">
        ↩ Sign out
      </button>
    </div>
  );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */

  /* Not authenticated → show login */
  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  /* Back Office — admin only */
  if (view === 'backoffice' && currentUser.role === 'admin') {
    return (
      <>
        <BackOffice
          products={products}
          transactions={transactions}
          onGoToPOS={() => setView('pos')}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          headerAction={userChip}
        />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  /* POS */
  return (
    <div className="app">
      <Header
        title="Point of Sale"
        action={
          <div className="app__header-actions">
            {currentUser.role === 'admin' && (
              <Button
                variant="ghost-light"
                size="sm"
                onClick={() => setView('backoffice')}
                type="button"
              >
                Back Office →
              </Button>
            )}
            {userChip}
          </div>
        }
      />

      <div className="app__body">
        <main className="app__products">
          <ProductSection products={products} onAddToCart={handleAddToCart} />
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

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
