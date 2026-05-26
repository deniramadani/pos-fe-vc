import React, { useState } from 'react';
import { Product } from '../../types';
import { Button } from '../atoms';
import './GoodsMovementForm.css';

interface GoodsMovementFormProps {
  type:      'in' | 'out';
  products:  Product[];
  onSubmit:  (data: {
    productId: string;
    quantity:  number;
    date:      Date;
    notes:     string;
  }) => void;
}

const todayISO = () => new Date().toISOString().split('T')[0];

/**
 * Molecule — controlled form for recording incoming or outgoing goods.
 * In 'out' mode: shows available stock hint and blocks if qty exceeds stock.
 * Composes: Button (atom)
 */
export const GoodsMovementForm: React.FC<GoodsMovementFormProps> = ({
  type,
  products,
  onSubmit,
}) => {
  const [productId, setProductId] = useState('');
  const [quantity,  setQuantity]  = useState<string>('');
  const [date,      setDate]      = useState(todayISO);
  const [notes,     setNotes]     = useState('');
  const [errors,    setErrors]    = useState<Record<string, string>>({});

  const clearErr = (key: string) => setErrors(p => ({ ...p, [key]: '' }));

  const selectedProduct = products.find(p => p.id === productId);
  const isOut           = type === 'out';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!productId)                          e.productId = 'Select a product';
    const qty = parseInt(quantity, 10);
    if (!quantity || isNaN(qty) || qty <= 0) e.quantity  = 'Enter a quantity greater than 0';
    if (isOut && selectedProduct && qty > selectedProduct.stock) {
      e.quantity = `Exceeds available stock (${selectedProduct.stock} left)`;
    }
    if (!date)                               e.date      = 'Select a date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    /* Parse date at local midnight to avoid timezone day-off issues */
    const [y, m, d] = date.split('-').map(Number);
    onSubmit({
      productId,
      quantity: parseInt(quantity, 10),
      date:     new Date(y, m - 1, d),
      notes:    notes.trim(),
    });

    /* Reset */
    setProductId('');
    setQuantity('');
    setDate(todayISO());
    setNotes('');
    setErrors({});
  };

  const stockHint = selectedProduct
    ? `${selectedProduct.stock} available`
    : '';

  return (
    <form className="gm-form" onSubmit={handleSubmit} noValidate>
      <div className="gm-form__grid">

        {/* Product */}
        <label className="gm-form__field gm-form__field--full">
          <span className="gm-form__label">Product</span>
          <select
            className={`gm-form__select ${errors.productId ? 'gm-form__select--error' : ''}`}
            value={productId}
            onChange={e => { setProductId(e.target.value); clearErr('productId'); }}
          >
            <option value="">— Choose product —</option>
            {products.map(p => (
              <option
                key={p.id}
                value={p.id}
                disabled={isOut && p.stock === 0}
              >
                {p.name}
                {isOut ? `  (${p.stock} in stock)` : ''}
              </option>
            ))}
          </select>
          {errors.productId && (
            <span className="gm-form__error">{errors.productId}</span>
          )}
        </label>

        {/* Quantity */}
        <label className="gm-form__field">
          <span className="gm-form__label">
            Quantity
            {isOut && stockHint && (
              <span className="gm-form__stock-hint">{stockHint}</span>
            )}
          </span>
          <input
            className={`gm-form__input ${errors.quantity ? 'gm-form__input--error' : ''}`}
            type="number"
            value={quantity}
            onChange={e => { setQuantity(e.target.value); clearErr('quantity'); }}
            placeholder="0"
            min="1"
            max={isOut && selectedProduct ? selectedProduct.stock : undefined}
            step="1"
          />
          {errors.quantity && (
            <span className="gm-form__error">{errors.quantity}</span>
          )}
        </label>

        {/* Date */}
        <label className="gm-form__field">
          <span className="gm-form__label">Date</span>
          <input
            className={`gm-form__input ${errors.date ? 'gm-form__input--error' : ''}`}
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); clearErr('date'); }}
          />
          {errors.date && (
            <span className="gm-form__error">{errors.date}</span>
          )}
        </label>

        {/* Notes */}
        <label className="gm-form__field gm-form__field--full">
          <span className="gm-form__label">
            Notes
            <span className="gm-form__optional">(optional)</span>
          </span>
          <textarea
            className="gm-form__textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={
              isOut
                ? 'e.g. Sold to wholesale client, damaged goods…'
                : 'e.g. Supplier delivery, weekly restock…'
            }
            rows={2}
          />
        </label>
      </div>

      <div className="gm-form__actions">
        <Button
          variant={isOut ? 'danger' : 'primary'}
          size="md"
          type="submit"
        >
          {isOut ? '📤 Record Outgoing' : '📥 Record Incoming'}
        </Button>
      </div>
    </form>
  );
};
