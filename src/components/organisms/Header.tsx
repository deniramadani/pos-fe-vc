import React from 'react';
import './Header.css';

interface HeaderProps {
  title?: string;
}

/**
 * Organism — top navigation bar with brand identity.
 */
export const Header: React.FC<HeaderProps> = ({ title = 'Point of Sale' }) => (
  <header className="header" role="banner">
    <div className="header__brand">
      <span className="header__icon" aria-hidden="true">🛒</span>
      <h1 className="header__title">{title}</h1>
    </div>
    <div className="header__tagline">Fast · Accurate · Simple</div>
  </header>
);
