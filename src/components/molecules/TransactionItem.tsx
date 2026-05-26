import React from 'react';
import { Transaction } from '../../types';
import { Badge, Price } from '../atoms';
import './TransactionItem.css';

interface TransactionItemProps {
  transaction: Transaction;
}

/**
 * Molecule — summary of one completed transaction.
 * Composes: Badge, Price
 */
export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => (
  <div className="txn-item">
    <div className="txn-item__header">
      <span className="txn-item__time">
        {transaction.timestamp.toLocaleString()}
      </span>
      <Badge variant={transaction.paymentMethod === 'cash' ? 'yellow' : 'orange'}>
        {transaction.paymentMethod}
      </Badge>
    </div>

    <div className="txn-item__lines">
      {transaction.items.map(item => (
        <div key={item.product.id} className="txn-item__line">
          <span className="txn-item__line-name">{item.product.name}</span>
          <span className="txn-item__line-qty">×{item.quantity}</span>
          <Price
            amount={item.product.price * item.quantity}
            size="sm"
            color="default"
          />
        </div>
      ))}
    </div>

    <div className="txn-item__total">
      <Price amount={transaction.total} size="md" label="Total" color="accent" />
    </div>
  </div>
);
