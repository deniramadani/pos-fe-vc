import React from 'react';
import { Product } from '../../types';
import { Button, Price, Badge } from '../atoms';
import './ProductRow.css';

interface ProductRowProps {
  product:  Product;
  onEdit:   (product: Product) => void;
  onDelete: (productId: string) => void;
}

/**
 * Molecule — single row in the product management table.
 * Composes: Price, Badge, Button (atoms)
 */
export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onEdit,
  onDelete,
}) => (
  <tr className="product-row">
    <td className="product-row__name">{product.name}</td>
    <td>
      <Badge variant="cream">{product.category}</Badge>
    </td>
    <td>
      <Price amount={product.price} size="md" />
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
