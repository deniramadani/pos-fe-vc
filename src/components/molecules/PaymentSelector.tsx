import React from 'react';
import './PaymentSelector.css';

interface PaymentSelectorProps {
  value:    'cash' | 'card';
  onChange: (method: 'cash' | 'card') => void;
}

const METHODS: { value: 'cash' | 'card'; label: string; icon: string }[] = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'card', label: 'Card', icon: '💳' },
];

/**
 * Molecule — toggle between cash and card payment methods.
 */
export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="payment-selector">
    <span className="payment-selector__label">Payment method</span>
    <div className="payment-selector__options">
      {METHODS.map(m => (
        <label
          key={m.value}
          className={[
            'payment-selector__option',
            value === m.value ? 'payment-selector__option--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            type="radio"
            name="pos-payment"
            value={m.value}
            checked={value === m.value}
            onChange={() => onChange(m.value)}
          />
          <span className="payment-selector__icon">{m.icon}</span>
          {m.label}
        </label>
      ))}
    </div>
  </div>
);
