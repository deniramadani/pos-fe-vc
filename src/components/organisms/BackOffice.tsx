import React, { useState } from 'react';
import { GoodsMovement, Product, Transaction } from '../../types';
import { Button } from '../atoms';
import { Header } from './Header';
import { DashboardPanel }        from './DashboardPanel';
import { ProductManagerPanel }   from './ProductManagerPanel';
import { TransactionLogPanel }   from './TransactionLogPanel';
import { GoodsMovementPanel }    from './GoodsMovementPanel';
import './BackOffice.css';

type Tab = 'dashboard' | 'products' | 'transactions' | 'stock-in' | 'stock-out';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard' },
  { id: 'products',     icon: '📦', label: 'Products' },
  { id: 'transactions', icon: '🧾', label: 'Sales' },
  { id: 'stock-in',     icon: '📥', label: 'Stock In' },
  { id: 'stock-out',    icon: '📤', label: 'Stock Out' },
];

interface BackOfficeProps {
  products:        Product[];
  transactions:    Transaction[];
  goodsMovements:  GoodsMovement[];
  onGoToPOS:       () => void;
  onAddProduct:    (data: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onStockIn:       (productId: string, quantity: number, date: Date, notes: string) => void;
  onStockOut:      (productId: string, quantity: number, date: Date, notes: string) => void;
  headerAction?:   React.ReactNode;
}

/**
 * Organism / Page — Back Office shell with 5-tab navigation.
 * Composes: Header (organism) + DashboardPanel, ProductManagerPanel,
 *           TransactionLogPanel, GoodsMovementPanel (organisms) + Button (atom)
 */
export const BackOffice: React.FC<BackOfficeProps> = ({
  products,
  transactions,
  goodsMovements,
  onGoToPOS,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onStockIn,
  onStockOut,
  headerAction,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const inMovements  = goodsMovements.filter(m => m.type === 'in');
  const outMovements = goodsMovements.filter(m => m.type === 'out');

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
        {activeTab === 'stock-in' && (
          <GoodsMovementPanel
            type="in"
            movements={inMovements}
            products={products}
            onSubmit={onStockIn}
          />
        )}
        {activeTab === 'stock-out' && (
          <GoodsMovementPanel
            type="out"
            movements={outMovements}
            products={products}
            onSubmit={onStockOut}
          />
        )}
      </main>
    </div>
  );
};
