import React from 'react';
import './Badge.css';

export type BadgeVariant = 'navy' | 'orange' | 'yellow' | 'red' | 'cream';

interface BadgeProps {
  variant?:  BadgeVariant;
  children:  React.ReactNode;
}

/** Atom — small label pill for status / categorisation. */
export const Badge: React.FC<BadgeProps> = ({ variant = 'navy', children }) => (
  <span className={`badge badge--${variant}`}>{children}</span>
);
