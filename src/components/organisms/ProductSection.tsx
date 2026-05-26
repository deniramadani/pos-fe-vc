import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../molecules';
import './ProductSection.css';

interface ProductSectionProps {
  products:    Product[];
  onAddToCart: (product: Product) => void;
  cartQty?:    (productId: string) => number;   /* units already in cart */
}

/**
 * Organism — full product catalogue grouped by category.
 * Composes: ProductCard (molecule) in a responsive grid.
 */
export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  onAddToCart,
  cartQty,
}) => {
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <section className="product-section" aria-label="Product catalogue">
      <h2 className="product-section__heading">Menu</h2>

      {categories.map(category => (
        <div key={category} className="product-section__group">
          <h3 className="product-section__category-label">{category}</h3>
          <div className="product-section__grid">
            {products
              .filter(p => p.category === category)
              .map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQty={cartQty ? cartQty(product.id) : 0}
                  onAdd={onAddToCart}
                />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
};
