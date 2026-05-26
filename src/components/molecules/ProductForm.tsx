import React, { useState, useId } from 'react';
import { Product } from '../../types';
import { Button } from '../atoms';
import './ProductForm.css';

interface ProductFormProps {
  product?:    Product;       /* present → edit mode */
  categories:  string[];      /* for datalist autocomplete */
  onSubmit:    (data: Omit<Product, 'id'>) => void;
  onCancel:    () => void;
}

/**
 * Molecule — controlled form for adding or editing a product.
 * Composes: Button (atom)
 */
export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
}) => {
  const uid         = useId();
  const isEdit      = Boolean(product);

  const [name,     setName]     = useState(product?.name     ?? '');
  const [price,    setPrice]    = useState(product?.price    ?? '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                    e.name     = 'Name is required';
    if (!category.trim())                e.category = 'Category is required';
    if (!price || Number(price) <= 0)    e.price    = 'Enter a price greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), price: parseFloat(String(price)), category: category.trim() });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <h3 className="product-form__title">
        {isEdit ? '✏️ Edit Product' : '➕ New Product'}
      </h3>

      <div className="product-form__grid">
        {/* Name */}
        <label className="product-form__field">
          <span className="product-form__label">Product name</span>
          <input
            className={`product-form__input ${errors.name ? 'product-form__input--error' : ''}`}
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
            placeholder="e.g. Espresso"
          />
          {errors.name && <span className="product-form__error">{errors.name}</span>}
        </label>

        {/* Price */}
        <label className="product-form__field">
          <span className="product-form__label">Price ($)</span>
          <input
            className={`product-form__input ${errors.price ? 'product-form__input--error' : ''}`}
            type="number"
            value={price}
            onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })); }}
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
          {errors.price && <span className="product-form__error">{errors.price}</span>}
        </label>

        {/* Category */}
        <label className="product-form__field product-form__field--full">
          <span className="product-form__label">Category</span>
          <input
            className={`product-form__input ${errors.category ? 'product-form__input--error' : ''}`}
            type="text"
            value={category}
            onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })); }}
            list={`${uid}-cats`}
            placeholder="e.g. Beverages"
          />
          <datalist id={`${uid}-cats`}>
            {categories.map(c => <option key={c} value={c} />)}
          </datalist>
          {errors.category && <span className="product-form__error">{errors.category}</span>}
        </label>
      </div>

      <div className="product-form__actions">
        <Button variant="ghost"   size="md" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" size="md" type="submit">
          {isEdit ? 'Save changes' : 'Add product'}
        </Button>
      </div>
    </form>
  );
};
