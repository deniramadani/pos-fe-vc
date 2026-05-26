import React from 'react';
import './QuantityInput.css';

interface QuantityInputProps {
  value:    number;
  onChange: (value: number) => void;
  min?:     number;
  max?:     number;
}

/** Atom — +/− stepper for numeric quantities. */
export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 0,
  max,
}) => {
  const clamp = (n: number) =>
    max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n);

  return (
    <div className="qty-input">
      <button
        className="qty-input__btn"
        onClick={() => onChange(clamp(value - 1))}
        aria-label="Decrease quantity"
        type="button"
      >
        −
      </button>
      <input
        className="qty-input__field"
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(clamp(parseInt(e.target.value) || min))}
        aria-label="Quantity"
      />
      <button
        className="qty-input__btn"
        onClick={() => onChange(clamp(value + 1))}
        aria-label="Increase quantity"
        type="button"
      >
        +
      </button>
    </div>
  );
};
