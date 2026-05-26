import React, { useState } from 'react';
import { Product, Transaction } from '../../types';
import { Button } from '../atoms';
import { Header } from './Header';
import { DashboardPanel }        from './DashboardPanel';
import { ProductManagerPanel }   from './ProductManagerPanel';
import { TransactionLogPanel }   from './TransactionLogPanel';
import './BackOffice.css';

type Tab = 'dashboard' | 'products' | 'transactions';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard' },
  { id: 'products',     icon: '📦', label: 'Products' },
  { id: 'transactions', icon: '🧾', label: 'Transactions' },
];

interface BackOfficeProps {
  products:        Product[];
  transactions:    Transaction[];
  onGoToPOS:       () => void;
  onAddProduct:    (data: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  headerAction?:   React.ReactNode;   /* user chip + logout from App */
}

/**
 * Organism / Page — Back Office shell with tab navigation.
 * Composes: Header (organism) + DashboardPanel, ProductManagerPanel,
 *           TransactionLogPanel (organisms) + Button (atom)
 */
export const BackOffice: React.FC<BackOfficeProps> = ({
  products,
  transactions,
  onGoToPOS,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  headerAction,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="back-office">
      <Header
        title="Back Office"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost-light" size="sm" onClick={onGoToPOS} type="button">
              ← Go to POS
            </Button>
            {headerAction}
          </div>
        }
      />

      {/* ── Tab navigation ── */}
      <nav className="back-office__tabs" role="tablist" aria-label="Back office sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`back-office__tab ${activeTab === tab.id ? 'back-office__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            <span className="back-office__tab-icon" aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main className="back-office__content" role="tabpanel">
        {activeTab === 'dashboard' && (
          <DashboardPanel transactions={transactions} />
        )}
        {activeTab === 'products' && (
          <ProductManagerPanel
            products={products}
            onAdd={onAddProduct}
            onUpdate={onUpdateProduct}
            onDelete={onDeleteProduct}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionLogPanel transactions={transactions} />
        )}
      </main>
    </div>
  );
};
