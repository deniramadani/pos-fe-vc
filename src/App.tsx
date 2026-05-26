import React, { useState, useCallback, useEffect } from 'react';
import { Product, CartItem, Transaction, User, GoodsMovement } from './types';
import * as api from './api';
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

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    if (username.includes('@')) {
      try {
        const result = await api.login(username, password);
        api.setStoredToken(result.token);
        setBackendEnabled(true);
        setCurrentUser({ username: result.user.email, role: result.user.role });
        await loadBackendData();
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        pushToast({ type: 'error', message, duration: 4000 });
        return false;
      }
    }

    const match = USERS.find(
      u => u.username === username && u.password === password
    );
    if (match) {
      setCurrentUser({ username: match.username, role: match.role });
      setBackendEnabled(false);
      return true;
    }
    return false;
  };

  const handleGoogleSignIn = async (idToken: string): Promise<boolean> => {
    try {
      const result = await api.loginWithGoogle(idToken);
      // If backend returned a token, store it and enable backend mode
      if (result?.token) {
        api.setStoredToken(result.token);
        setBackendEnabled(!!process.env.REACT_APP_API_BASE_URL);
      }
      setCurrentUser({ username: result.user.email, role: result.user.role });
      if (process.env.REACT_APP_API_BASE_URL) {
        await loadBackendData();
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      pushToast({ type: 'error', message, duration: 4000 });
      return false;
    }
  };

  const handleLogout = () => {
    api.setStoredToken(null);
    setCurrentUser(null);
    setView('pos');
    setCart([]);
    setBackendEnabled(false);
  };

  /* ── View ── */
  const [view, setView] = useState<AppView>('pos');
  const [backendEnabled, setBackendEnabled] = useState(false);

  /* ── POS state ── */
  const [products,       setProducts]       = useState<Product[]>([]);
  const [cart,           setCart]           = useState<CartItem[]>([]);
  const [transactions,   setTransactions]   = useState<Transaction[]>([]);
  const [goodsMovements, setGoodsMovements] = useState<GoodsMovement[]>([]);
  const [toasts,         setToasts]         = useState<ToastData[]>([]);

  /* ── Toast helpers ── */
  const pushToast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { ...data, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const loadBackendData = useCallback(async () => {
    // Load each resource independently so a failure in one never blocks the others.
    const results = await Promise.allSettled([
      api.listProducts(),
      api.listTransactions(),
      api.listGoodsMovements(),
    ]);

    const [productsResult, transactionsResult, movementsResult] = results;

    if (productsResult.status === 'fulfilled') {
      setProducts(productsResult.value);
      setBackendEnabled(true);
    } else {
      setBackendEnabled(false);
      pushToast({
        type: 'error',
        message: 'Could not load products from backend.',
        duration: 4000,
      });
    }

    if (transactionsResult.status === 'fulfilled') {
      setTransactions(transactionsResult.value);
    }

    if (movementsResult.status === 'fulfilled') {
      setGoodsMovements(movementsResult.value);
    }
  }, [pushToast]);

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      const token = await api.authToken();
      if (!token || ignore) return;

      try {
        const user = await api.me();
        if (ignore) return;
        setCurrentUser({ username: user.email, role: user.role });
        setBackendEnabled(true);
        await loadBackendData();
      } catch {
        if (ignore) return;
        api.setStoredToken(null);
        setBackendEnabled(false);
      }
    };

    restoreSession();

    return () => { ignore = true; };
  }, [loadBackendData]);

  /* ── Realtime polling ── */
  useEffect(() => {
    if (!backendEnabled) return;

    /** Silently refresh products + transactions in the background. */
    const poll = async () => {
      const [productsResult, transactionsResult, movementsResult] = await Promise.allSettled([
        api.listProducts(),
        api.listTransactions(),
        api.listGoodsMovements(),
      ]);
      if (productsResult.status === 'fulfilled')     setProducts(productsResult.value);
      if (transactionsResult.status === 'fulfilled') setTransactions(transactionsResult.value);
      if (movementsResult.status === 'fulfilled')    setGoodsMovements(movementsResult.value);
    };

    // Re-fetch immediately when the user returns to this tab.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void poll();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    const timer = setInterval(() => void poll(), 10_000);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [backendEnabled]);

  /* ── Product CRUD ── */
  const handleAddProduct = async (data: Omit<Product, 'id'>) => {
    if (backendEnabled) {
      try {
        const created = await api.createProduct(data);
        setProducts(prev => [...prev, created]);
        pushToast({ type: 'success', message: `"${created.name}" added`, duration: 2500 });
        return;
      } catch (error) {
        pushToast({ type: 'error', message: 'Could not create product in backend', duration: 3500 });
      }
    }

    setProducts(prev => [...prev, { ...data, id: Date.now().toString() }]);
    pushToast({ type: 'success', message: `"${data.name}" added`, duration: 2500 });
  };

  const handleUpdateProduct = async (product: Product) => {
    if (backendEnabled) {
      try {
        const updated = await api.updateProduct(product);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        pushToast({ type: 'success', message: `"${updated.name}" updated`, duration: 2500 });
        return;
      } catch (error) {
        pushToast({ type: 'error', message: 'Could not update product in backend', duration: 3500 });
      }
    }

    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    pushToast({ type: 'success', message: `"${product.name}" updated`, duration: 2500 });
  };

  const handleDeleteProduct = async (productId: string) => {
    const name = products.find(p => p.id === productId)?.name ?? 'Product';
    if (backendEnabled) {
      try {
        await api.deleteProduct(productId);
      } catch (error) {
        pushToast({ type: 'error', message: 'Could not delete product in backend', duration: 3500 });
      }
    }

    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(i => i.product.id !== productId));
    pushToast({ type: 'info', message: `"${name}" deleted`, duration: 2500 });
  };

  /* ── Goods movement handlers ── */
  const handleStockIn = useCallback((
    productId: string,
    quantity:  number,
    date:      Date,
    notes:     string,
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const recordMovement = async () => {
      if (backendEnabled) {
        try {
          const movement = await api.createGoodsMovement('in', productId, quantity, date, notes);
          setGoodsMovements(prev => [movement, ...prev]);
          setProducts(prev =>
            prev.map(p => p.id === productId ? { ...p, stock: p.stock + quantity } : p)
          );
          pushToast({
            type:     'success',
            message:  `📥 Stock in: ${product.name}`,
            sub:      `+${quantity} units — new stock: ${product.stock + quantity}`,
            duration: 3500,
          });
          return;
        } catch {
          pushToast({ type: 'error', message: 'Could not save stock-in movement to backend', duration: 3500 });
        }
      }

      setProducts(prev =>
        prev.map(p => p.id === productId ? { ...p, stock: p.stock + quantity } : p)
      );
      setGoodsMovements(prev => [
        {
          id:          Date.now().toString(),
          type:        'in',
          productId,
          productName: product.name,
          quantity,
          date,
          notes,
        },
        ...prev,
      ]);
      pushToast({
        type:     'success',
        message:  `📥 Stock in: ${product.name}`,
        sub:      `+${quantity} units — new stock: ${product.stock + quantity}`,
        duration: 3500,
      });
    };

    void recordMovement();
  }, [backendEnabled, products, pushToast]);

  const handleStockOut = useCallback((
    productId: string,
    quantity:  number,
    date:      Date,
    notes:     string,
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      pushToast({
        type:     'error',
        message:  'Insufficient stock',
        sub:      `Only ${product.stock} "${product.name}" available`,
        duration: 4000,
      });
      return;
    }

    const recordMovement = async () => {
      if (backendEnabled) {
        try {
          const movement = await api.createGoodsMovement('out', productId, quantity, date, notes);
          setGoodsMovements(prev => [movement, ...prev]);
          setProducts(prev =>
            prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p)
          );
          pushToast({
            type:     'info',
            message:  `📤 Stock out: ${product.name}`,
            sub:      `−${quantity} units — new stock: ${product.stock - quantity}`,
            duration: 3500,
          });
          return;
        } catch {
          pushToast({ type: 'error', message: 'Could not save stock-out movement to backend', duration: 3500 });
        }
      }

      setProducts(prev =>
        prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p)
      );
      setGoodsMovements(prev => [
        {
          id:          Date.now().toString(),
          type:        'out',
          productId,
          productName: product.name,
          quantity,
          date,
          notes,
        },
        ...prev,
      ]);
      pushToast({
        type:     'info',
        message:  `📤 Stock out: ${product.name}`,
        sub:      `−${quantity} units — new stock: ${product.stock - quantity}`,
        duration: 3500,
      });
    };

    void recordMovement();
  }, [backendEnabled, products, pushToast]);

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

    const completeCheckout = async () => {
      if (backendEnabled) {
        try {
          const txn = await api.checkoutTransaction(validatedCart, paymentMethod);
          setTransactions(prev => [txn, ...prev]);
          setCart([]);
          setProducts(prev =>
            prev.map(p => {
              const sold = validatedCart.find(i => i.product.id === p.id);
              return sold ? { ...p, stock: Math.max(0, p.stock - sold.quantity) } : p;
            })
          );
          pushToast({
            type:     'success',
            message:  'Transaction complete!',
            sub:      `$${total.toFixed(2)} paid by ${paymentMethod === 'cash' ? '💵 cash' : '💳 card'}`,
            duration: 4000,
          });
          return;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Checkout failed';
          pushToast({ type: 'error', message, duration: 4000 });
          return;
        }
      }

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
    };

    void completeCheckout();
  }, [backendEnabled, cart, products, pushToast]);

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
        <LoginPage onLogin={handleLogin} onGoogle={handleGoogleSignIn} />
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
          goodsMovements={goodsMovements}
          onGoToPOS={() => setView('pos')}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onStockIn={handleStockIn}
          onStockOut={handleStockOut}
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
