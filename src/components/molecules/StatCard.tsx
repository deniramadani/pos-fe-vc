import React from 'react';
import './StatCard.css';

export type StatCardColor = 'orange' | 'red' | 'yellow' | 'navy';

interface StatCardProps {
  icon:    string;
  label:   string;
  value:   string;
  sub?:    string;
  color?:  StatCardColor;
}

/**
 * Molecule — KPI metric tile with coloured top stripe.
 * Used on the Back Office dashboard.
 */
export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  sub,
  color = 'orange',
}) => (
  <div className={`stat-card stat-card--${color}`}>
    <span className="stat-card__icon" aria-hidden="true">{icon}</span>
    <div className="stat-card__body">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {sub && <span className="stat-card__sub">{sub}</span>}
    </div>
  </div>
);
