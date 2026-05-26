import React, { useState } from 'react';
import { CartItem } from '../../types';
import { Button, Price } from '../atoms';
import { CartItemRow, PaymentSelector, ConfirmBar } from '../molecules';
import './CartPanel.css';

interface CartPanelProps {
  items:            CartItem[];
  onRemoveItem:     (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout:       (paymentMethod: 'cash' | 'card') => void;
  onClearCart:      () => void;
}

/**
 * Organism — full cart panel: item list, payment selection, checkout.
 * Composes: CartItemRow, PaymentSelector, ConfirmBar (molecules) + Button, Price (atoms).
 * Uses ConfirmBar inline instead of window.confirm() for the clear action.
 */
export const CartPanel: React.FC<CartPanelProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  onClearCart,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [clearPending,  setClearPending]  = useState(false);

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const handleConfirmClear = () => {
    setClearPending(false);
    onClearCart();
  };

  return (
    <div className="cart-panel">
      {/* ── Header ── */}
      <div className="cart-panel__header">
        <h2 className="cart-panel__title">Cart</h2>
        {count > 0 && (
          <span className="cart-panel__badge">
            {count} item{count !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Empty state ── */}
      {items.length === 0 ? (
        <div className="cart-panel__empty">
          <span className="cart-panel__empty-icon" aria-hidden="true">🧺</span>
          <p className="cart-panel__empty-text">Your cart is empty</p>
          <p className="cart-panel__empty-hint">Tap any item to add it</p>
        </div>
      ) : (
        <>
          {/* ── Item list ── */}
          <div className="cart-panel__items">
            {items.map(item => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))}
          </div>

          {/* ── Summary ── */}
          <div className="cart-panel__summary">
            <div className="cart-panel__total">
              <Price amount={total} size="xl" label="Total" />
            </div>

            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />

            {/* Inline confirm replaces the action row when Clear is pending */}
            {clearPending ? (
              <ConfirmBar
                message="Remove all items from the cart?"
                confirmLabel="Yes, clear"
                cancelLabel="Keep"
                onConfirm={handleConfirmClear}
                onCancel={() => setClearPending(false)}
              />
            ) : (
              <div className="cart-panel__actions">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setClearPending(true)}
                  type="button"
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => onCheckout(paymentMethod)}
                  type="button"
                  className="cart-panel__checkout-btn"
                >
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
