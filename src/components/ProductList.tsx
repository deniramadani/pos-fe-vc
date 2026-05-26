import React from 'react';
import { Product, CartItem } from '../types';
import './ProductList.css';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<Props> = ({ products, onAddToCart }) => {
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="product-list">
      <h2>Products</h2>
      {categories.map(category => (
        <div key={category} className="category">
          <h3>{category}</h3>
          <div className="products-grid">
            {products
              .filter(p => p.category === category)
              .map(product => (
                <div key={product.id} className="product-card">
                  <h4>{product.name}</h4>
                  <p className="price">${product.price.toFixed(2)}</p>
                  <button
                    className="add-btn"
                    onClick={() => onAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};