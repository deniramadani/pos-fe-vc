import React from 'react';
import { Transaction } from '../../types';
import { TransactionItem } from '../molecules';
import './TransactionPanel.css';

interface TransactionPanelProps {
  transactions: Transaction[];
}

/**
 * Organism — scrollable history of completed transactions.
 * Composes: TransactionItem (molecule).
 */
export const TransactionPanel: React.FC<TransactionPanelProps> = ({
  transactions,
}) => (
  <div className="txn-panel" aria-label="Transaction history">
    <div className="txn-panel__header">
      <h2 className="txn-panel__title">History</h2>
      {transactions.length > 0 && (
        <span className="txn-panel__count" aria-label={`${transactions.length} transactions`}>
          {transactions.length}
        </span>
      )}
    </div>

    {transactions.length === 0 ? (
      <p className="txn-panel__empty">No transactions yet</p>
    ) : (
      <div className="txn-panel__list">
        {transactions.map(txn => (
          <TransactionItem key={txn.id} transaction={txn} />
        ))}
      </div>
    )}
  </div>
);
