import React from 'react';
import { Product } from '../../types';
import { Button, Price } from '../atoms';
import './ProductCard.css';

interface ProductCardProps {
  product:   Product;
  cartQty?:  number;   /* units already in the active cart */
  onAdd:     (product: Product) => void;
}

/* stock thresholds */
const isOutOfStock = (s: number) => s === 0;
const isLow        = (s: number) => s > 0 && s <= 10;

/**
 * Molecule — product tile with live stock indicator.
 * Disabled when out of stock; shows "X left" badge when stock ≤ 10.
 * Composes: Price, Button (atoms)
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQty = 0,
  onAdd,
}) => {
  const { stock } = product;
  const atLimit    = cartQty >= stock && stock > 0;
  const outOfStock = isOutOfStock(stock);
  const low        = isLow(stock);

  return (
    <div className={`product-card ${outOfStock ? 'product-card--out' : ''}`}>
      <div className="product-card__body">
        <span className="product-card__name">{product.name}</span>
        <Price amount={product.price} size="lg" color={outOfStock ? 'muted' : 'accent'} />

        {/* Stock badge */}
        {outOfStock ? (
          <span className="product-card__stock product-card__stock--out">
            Out of stock
          </span>
        ) : low ? (
          <span className="product-card__stock product-card__stock--low">
            {stock} left
          </span>
        ) : null}
      </div>

      <Button
        variant="primary"
        size="sm"
        fullWidth
        onClick={() => onAdd(product)}
        disabled={outOfStock || atLimit}
        className="product-card__cta"
        title={atLimit ? `Only ${stock} in stock` : undefined}
      >
        {outOfStock ? 'Out of stock' : atLimit ? `Limit reached` : '+ Add'}
      </Button>
    </div>
  );
};
