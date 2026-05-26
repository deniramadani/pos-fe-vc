import React from 'react';
import './Price.css';

export type PriceSize  = 'sm' | 'md' | 'lg' | 'xl';
export type PriceColor = 'default' | 'accent' | 'muted';

interface PriceProps {
  amount: number;
  size?:  PriceSize;
  color?: PriceColor;
  label?: string;
}

/** Atom — formatted currency display. */
export const Price: React.FC<PriceProps> = ({
  amount,
  size  = 'md',
  color = 'default',
  label,
}) => (
  <span className={`price price--${size} price--${color}`}>
    {label && <span className="price__label">{label}</span>}
    <span className="price__symbol">$</span>
    <span className="price__amount">{amount.toFixed(2)}</span>
  </span>
);
