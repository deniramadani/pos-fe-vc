import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types';
import { TransactionRow } from '../molecules';
import './TransactionLogPanel.css';

interface TransactionLogPanelProps {
  transactions: Transaction[];
}

type PaymentFilter = 'all' | 'cash' | 'card';

/**
 * Organism — searchable, filterable transaction history table.
 * Composes: TransactionRow (molecule)
 */
export const TransactionLogPanel: React.FC<TransactionLogPanelProps> = ({
  transactions,
}) => {
  const [search,        setSearch]        = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter(t => {
      const matchesPayment =
        paymentFilter === 'all' || t.paymentMethod === paymentFilter;
      const matchesSearch =
        !q ||
        t.items.some(i => i.product.name.toLowerCase().includes(q)) ||
        t.paymentMethod.includes(q) ||
        t.total.toFixed(2).includes(q);
      return matchesPayment && matchesSearch;
    });
  }, [transactions, search, paymentFilter]);

  const FILTERS: { value: PaymentFilter; label: string }[] = [
    { value: 'all',  label: 'All' },
    { value: 'cash', label: '💵 Cash' },
    { value: 'card', label: '💳 Card' },
  ];

  return (
    <div className="txn-log">
      {/* ── Toolbar ── */}
      <div className="txn-log__toolbar">
        <div>
          <h2 className="txn-log__title">Transactions</h2>
          <p className="txn-log__sub">
            {filtered.length} of {transactions.length} record{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="txn-log__controls">
          <input
            className="txn-log__search"
            type="search"
            placeholder="Search by product, amount…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search transactions"
          />
          <div className="txn-log__filter" role="group" aria-label="Filter by payment">
            {FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                className={`txn-log__filter-btn ${paymentFilter === f.value ? 'txn-log__filter-btn--active' : ''}`}
                onClick={() => setPaymentFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      {transactions.length === 0 ? (
        <div className="txn-log__empty">
          <span className="txn-log__empty-icon">🧾</span>
          <p>No transactions yet.</p>
          <p className="txn-log__empty-hint">Complete a sale in the POS to see records here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="txn-log__empty">
          <p>No results match your search.</p>
        </div>
      ) : (
        <div className="txn-log__table-wrap">
          <table className="txn-log__table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th aria-label="Expand" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => (
                <TransactionRow key={txn.id} transaction={txn} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
