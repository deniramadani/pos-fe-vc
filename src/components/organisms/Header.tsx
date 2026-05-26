import React from 'react';
import './Header.css';

interface HeaderProps {
  title?:  string;
  action?: React.ReactNode;   /* optional right-side slot (e.g. nav button) */
}

/**
 * Organism — top navigation bar with brand identity.
 * Pass `action` to render a button / element on the right side.
 */
export const Header: React.FC<HeaderProps> = ({
  title  = 'Point of Sale',
  action,
}) => (
  <header className="header" role="banner">
    <div className="header__brand">
      <span className="header__icon" aria-hidden="true">🛒</span>
      <h1 className="header__title">{title}</h1>
    </div>
    <div className="header__end">
      {action ?? <span className="header__tagline">Fast · Accurate · Simple</span>}
    </div>
  </header>
);
