import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import './Cart.css';

interface Props {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: (paymentMethod: 'cash' | 'card') => void;
  onClearCart: () => void;
}

export const Cart: React.FC<Props> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  onClearCart,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return <div className="cart empty">Cart is empty</div>;
  }

  return (
    <div className="cart">
      <h2>Cart</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.product.id} className="cart-item">
            <div className="item-info">
              <h4>{item.product.name}</h4>
              <p>${item.product.price.toFixed(2)} each</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>
                -
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e =>
                  onUpdateQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))
                }
              />
              <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <div className="item-total">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
            <button
              className="remove-btn"
              onClick={() => onRemoveItem(item.product.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>

        <div className="payment-method">
          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value as 'cash' | 'card')}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value as 'cash' | 'card')}
            />
            Card
          </label>
        </div>

        <div className="action-buttons">
          <button className="clear-btn" onClick={onClearCart}>
            Clear Cart
          </button>
          <button
            className="checkout-btn"
            onClick={() => onCheckout(paymentMethod)}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};