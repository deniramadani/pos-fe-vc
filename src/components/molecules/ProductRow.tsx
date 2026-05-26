import React from 'react';
import { Product } from '../../types';
import { Button, Price, Badge } from '../atoms';
import './ProductRow.css';

interface ProductRowProps {
  product:  Product;
  onEdit:   (product: Product) => void;
  onDelete: (productId: string) => void;
}

/* Derive stock badge variant + label */
const stockBadge = (stock: number): { variant: 'navy' | 'orange' | 'red'; label: string } => {
  if (stock === 0)   return { variant: 'red',    label: 'Out of stock' };
  if (stock <= 10)   return { variant: 'orange', label: `Low — ${stock}` };
  return               { variant: 'navy',   label: `${stock} in stock` };
};

/**
 * Molecule — single row in the product management table.
 * Composes: Price, Badge, Button (atoms)
 */
export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const { variant, label } = stockBadge(product.stock);

  return (
    <tr className="product-row">
      <td className="product-row__name">{product.name}</td>
      <td>
        <Badge variant="cream">{product.category}</Badge>
      </td>
      <td>
        <Price amount={product.price} size="md" />
      </td>
      <td>
        <Badge variant={variant}>{label}</Badge>
      </td>
      <td className="product-row__actions">
        <Button variant="ghost"  size="sm" type="button" onClick={() => onEdit(product)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" type="button" onClick={() => onDelete(product.id)}>
          Delete
        </Button>
      </td>
    </tr>
  );
};
