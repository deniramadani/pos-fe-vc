import React from 'react';
import { Transaction } from '../../types';
import { StatCard } from '../molecules';
import { Badge, Price } from '../atoms';
import './DashboardPanel.css';

interface DashboardPanelProps {
  transactions: Transaction[];
}

/**
 * Organism — Back Office overview: KPI cards, top products, recent activity.
 * Composes: StatCard (molecule) + Badge, Price (atoms)
 */
export const DashboardPanel: React.FC<DashboardPanelProps> = ({ transactions }) => {
  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
  const totalItems   = transactions.reduce(
    (s, t) => s + t.items.reduce((ss, i) => ss + i.quantity, 0), 0
  );
  const avgOrder = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  const cashCount = transactions.filter(t => t.paymentMethod === 'cash').length;
  const cardCount = transactions.filter(t => t.paymentMethod === 'card').length;

  /* Top 5 products by quantity sold */
  const topProducts = Object.entries(
    transactions
      .flatMap(t => t.items)
      .reduce((acc, item) => {
        acc[item.product.name] = (acc[item.product.name] ?? 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentTxns = transactions.slice(0, 6);

  if (transactions.length === 0) {
    return (
      <div className="dashboard">
        <div className="dashboard__stats">
          <StatCard icon="💰" label="Total Revenue"   value="$0.00" color="orange" />
          <StatCard icon="🧾" label="Transactions"    value="0"     color="navy" />
          <StatCard icon="📦" label="Items Sold"      value="0"     color="yellow" />
          <StatCard icon="📊" label="Avg Order Value" value="$0.00" color="red" />
        </div>
        <div className="dashboard__empty">
          <span className="dashboard__empty-icon">📈</span>
          <p>No transactions yet.</p>
          <p className="dashboard__empty-hint">Head to the POS to make your first sale.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* ── KPI cards ── */}
      <div className="dashboard__stats">
        <StatCard icon="💰" label="Total Revenue"   value={`$${totalRevenue.toFixed(2)}`} color="orange" />
        <StatCard icon="🧾" label="Transactions"    value={String(transactions.length)}   color="navy" />
        <StatCard icon="📦" label="Items Sold"      value={String(totalItems)}            color="yellow" />
        <StatCard icon="📊" label="Avg Order Value" value={`$${avgOrder.toFixed(2)}`}     color="red" />
      </div>

      <div className="dashboard__panels">
        {/* ── Payment split ── */}
        <div className="dashboard__card">
          <h3 className="dashboard__card-title">Payment Split</h3>
          <div className="dashboard__split">
            <div className="dashboard__split-item">
              <Badge variant="yellow">Cash</Badge>
              <span className="dashboard__split-count">{cashCount}</span>
              <span className="dashboard__split-pct">
                {transactions.length > 0
                  ? Math.round((cashCount / transactions.length) * 100)
                  : 0}%
              </span>
            </div>
            <div className="dashboard__split-bar">
              <div
                className="dashboard__split-fill dashboard__split-fill--cash"
                style={{ width: `${transactions.length > 0 ? (cashCount / transactions.length) * 100 : 0}%` }}
              />
              <div
                className="dashboard__split-fill dashboard__split-fill--card"
                style={{ width: `${transactions.length > 0 ? (cardCount / transactions.length) * 100 : 0}%` }}
              />
            </div>
            <div className="dashboard__split-item">
              <Badge variant="orange">Card</Badge>
              <span className="dashboard__split-count">{cardCount}</span>
              <span className="dashboard__split-pct">
                {transactions.length > 0
                  ? Math.round((cardCount / transactions.length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* ── Top products ── */}
        {topProducts.length > 0 && (
          <div className="dashboard__card">
            <h3 className="dashboard__card-title">Top Products</h3>
            <ol className="dashboard__top-list">
              {topProducts.map(([name, qty], i) => (
                <li key={name} className="dashboard__top-item">
                  <span className="dashboard__rank">{i + 1}</span>
                  <span className="dashboard__product-name">{name}</span>
                  <span className="dashboard__product-qty">{qty} sold</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ── Recent transactions ── */}
        <div className="dashboard__card dashboard__card--wide">
          <h3 className="dashboard__card-title">Recent Transactions</h3>
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.map(t => (
                <tr key={t.id}>
                  <td className="dashboard__table-time">{t.timestamp.toLocaleString()}</td>
                  <td>{t.items.length} item{t.items.length !== 1 ? 's' : ''}</td>
                  <td>
                    <Badge variant={t.paymentMethod === 'cash' ? 'yellow' : 'orange'}>
                      {t.paymentMethod}
                    </Badge>
                  </td>
                  <td><Price amount={t.total} size="md" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
