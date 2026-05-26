import React, { useState } from 'react';
import { Product, CartItem, Transaction } from './types';
import { PRODUCTS } from './data/products';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { TransactionHistory } from './components/TransactionHistory';
import './App.css';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const transaction: Transaction = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      timestamp: new Date(),
      paymentMethod,
    };

    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
    setCart([]);
    alert(`Transaction completed!\nTotal: $${total.toFixed(2)}\nPayment: ${paymentMethod}`);
  };

  const handleClearCart = () => {
    if (window.confirm('Clear cart?')) {
      setCart([]);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Point of Sale System</h1>
      </header>
      <div className="main-container">
        <div className="products-section">
          <ProductList products={PRODUCTS} onAddToCart={handleAddToCart} />
        </div>
        <div className="sidebar">
          <Cart
            items={cart}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
          />
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default App;