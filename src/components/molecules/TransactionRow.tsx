import React, { useState } from 'react';
import { Transaction } from '../../types';
import { Badge, Price } from '../atoms';
import './TransactionRow.css';

interface TransactionRowProps {
  transaction: Transaction;
}

/**
 * Molecule — expandable table row for a single transaction.
 * Click to expand / collapse the item breakdown.
 * Composes: Badge, Price (atoms)
 */
export const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className={`txn-row ${open ? 'txn-row--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Click to expand"
      >
        <td className="txn-row__time">
          {transaction.timestamp.toLocaleString()}
        </td>
        <td className="txn-row__items">
          {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}
        </td>
        <td>
          <Badge variant={transaction.paymentMethod === 'cash' ? 'yellow' : 'orange'}>
            {transaction.paymentMethod}
          </Badge>
        </td>
        <td>
          <Price amount={transaction.total} size="md" />
        </td>
        <td className="txn-row__chevron" aria-label={open ? 'Collapse' : 'Expand'}>
          {open ? '▲' : '▼'}
        </td>
      </tr>

      {open && (
        <tr className="txn-row__detail">
          <td colSpan={5}>
            <div className="txn-row__breakdown">
              {transaction.items.map(item => (
                <div key={item.product.id} className="txn-row__line">
                  <span className="txn-row__line-name">{item.product.name}</span>
                  <span className="txn-row__line-qty">× {item.quantity}</span>
                  <Price
                    amount={item.product.price * item.quantity}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
