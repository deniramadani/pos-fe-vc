import React from 'react';
import { Product } from '../../types';
import { Button, Price } from '../atoms';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAdd:   (product: Product) => void;
}

/**
 * Molecule — product tile combining name, price atom and add button atom.
 * Composes: Price, Button
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => (
  <div className="product-card">
    <div className="product-card__body">
      <span className="product-card__name">{product.name}</span>
      <Price amount={product.price} size="lg" color="accent" />
    </div>
    <Button
      variant="primary"
      size="sm"
      fullWidth
      onClick={() => onAdd(product)}
      className="product-card__cta"
    >
      + Add
    </Button>
  </div>
);
