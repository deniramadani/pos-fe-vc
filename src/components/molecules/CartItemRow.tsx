import React from 'react';
import { CartItem } from '../../types';
import { Button, QuantityInput, Price } from '../atoms';
import './CartItemRow.css';

interface CartItemRowProps {
  item:             CartItem;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove:         (productId: string) => void;
}

/**
 * Molecule — single cart line combining item info, qty stepper, line total, remove.
 * Composes: QuantityInput, Price, Button
 */
export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="cart-item-row">
      <div className="cart-item-row__info">
        <span className="cart-item-row__name">{item.product.name}</span>
        <Price amount={item.product.price} size="sm" color="muted" />
      </div>

      <div className="cart-item-row__controls">
        <QuantityInput
          value={item.quantity}
          onChange={qty => onUpdateQuantity(item.product.id, qty)}
          min={0}
          max={item.product.stock}
        />
        <Price amount={lineTotal} size="md" color="default" />
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(item.product.id)}
          aria-label={`Remove ${item.product.name}`}
          type="button"
        >
          ✕
        </Button>
      </div>
    </div>
  );
};
