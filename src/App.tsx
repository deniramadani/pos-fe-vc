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
  const handleAddToCart = useCallback((product: Product) => {
    /* Look up live stock from products state */
    const liveProduct = products.find(p => p.id === product.id) ?? product;
    const liveStock   = liveProduct.stock;

    if (liveStock === 0) {
      pushToast({ type: 'error', message: `"${product.name}" is out of stock`, duration: 3000 });
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      const currentQty = existing?.quantity ?? 0;

      if (currentQty >= liveStock) {
        pushToast({
          type: 'error',
          message: `Only ${liveStock} "${product.name}" in stock`,
          duration: 3000,
        });
        return prev;  /* no change */
      }

      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, product: liveProduct, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product: liveProduct, quantity: 1 }];
    });
  }, [products, pushToast]);

  const handleRemoveFromCart = useCallback((productId: string) =>
    setCart(prev => prev.filter(i => i.product.id !== productId)),
  []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) { handleRemoveFromCart(productId); return; }
    /* Cap at current live stock */
    const liveStock = products.find(p => p.id === productId)?.stock ?? Infinity;
    const capped    = Math.min(quantity, liveStock);
    setCart(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity: capped } : i))
    );
  }, [products, handleRemoveFromCart]);

  const handleCheckout = useCallback((paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;

    /* Validate against live stock and cap quantities */
    let invalid = false;
    const validatedCart = cart.map(item => {
      const liveStock = products.find(p => p.id === item.product.id)?.stock ?? item.product.stock;
      if (liveStock === 0) { invalid = true; return item; }
      return { ...item, quantity: Math.min(item.quantity, liveStock) };
    }).filter(item => {
      const liveStock = products.find(p => p.id === item.product.id)?.stock ?? item.product.stock;
      return liveStock > 0;
    });

    if (invalid) {
      pushToast({
        type:    'error',
        message: 'Some items are out of stock — cart updated',
        duration: 4000,
      });
      setCart(validatedCart);
      if (validatedCart.length === 0) return;
    }

    const total = validatedCart.reduce((s, i) => s + i.product.price * i.quantity, 0);

    /* Decrement stock for each item */
    setProducts(prev =>
      prev.map(p => {
        const sold = validatedCart.find(i => i.product.id === p.id);
        return sold ? { ...p, stock: Math.max(0, p.stock - sold.quantity) } : p;
      })
    );

    setTransactions(prev => [
      {
        id: Date.now().toString(),
        items: validatedCart,
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
  }, [cart, products, pushToast]);

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
          <ProductSection
            products={products}
            onAddToCart={handleAddToCart}
            cartQty={id => cart.find(i => i.product.id === id)?.quantity ?? 0}
          />
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
