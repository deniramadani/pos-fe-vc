import React from 'react';
import { Transaction } from '../types';
import './TransactionHistory.css';

interface Props {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-header">
                <span className="timestamp">
                  {transaction.timestamp.toLocaleString()}
                </span>
                <span className="payment-method">{transaction.paymentMethod}</span>
              </div>
              <div className="transaction-items">
                {transaction.items.map(item => (
                  <div key={item.product.id} className="transaction-product">
                    <span>{item.product.name}</span>
                    <span>x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="transaction-total">
                <strong>Total: ${transaction.total.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};