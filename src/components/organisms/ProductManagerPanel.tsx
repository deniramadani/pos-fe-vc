import React, { useState } from 'react';
import { Product } from '../../types';
import { Button } from '../atoms';
import { ProductForm, ProductRow, ConfirmBar } from '../molecules';
import './ProductManagerPanel.css';

type FormMode = 'hidden' | 'add' | 'edit';

interface ProductManagerPanelProps {
  products:        Product[];
  onAdd:           (data: Omit<Product, 'id'>) => void;
  onUpdate:        (product: Product) => void;
  onDelete:        (productId: string) => void;
}

/**
 * Organism — full product CRUD: table + inline add/edit form + ConfirmBar delete.
 * Composes: ProductRow, ProductForm, ConfirmBar (molecules) + Button (atom)
 */
export const ProductManagerPanel: React.FC<ProductManagerPanelProps> = ({
  products,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [formMode,       setFormMode]       = useState<FormMode>('hidden');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget,   setDeleteTarget]   = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormMode('edit');
    setDeleteTarget(null);
  };

  const handleRequestDelete = (productId: string) => {
    setDeleteTarget(productId);
    setFormMode('hidden');
    setEditingProduct(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteTarget(null);
  };

  const handleFormSubmit = (data: Omit<Product, 'id'>) => {
    if (formMode === 'edit' && editingProduct) {
      onUpdate({ ...editingProduct, ...data });
    } else {
      onAdd(data);
    }
    setFormMode('hidden');
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setFormMode('hidden');
    setEditingProduct(null);
  };

  const deleteTargetProduct = products.find(p => p.id === deleteTarget);

  return (
    <div className="product-manager">
      {/* ── Toolbar ── */}
      <div className="product-manager__toolbar">
        <div>
          <h2 className="product-manager__title">Products</h2>
          <p className="product-manager__sub">{products.length} item{products.length !== 1 ? 's' : ''}</p>
        </div>
        {formMode === 'hidden' && (
          <Button
            variant="primary"
            size="md"
            onClick={() => { setFormMode('add'); setDeleteTarget(null); }}
            type="button"
          >
            + Add product
          </Button>
        )}
      </div>

      {/* ── Inline form (add / edit) ── */}
      {formMode !== 'hidden' && (
        <ProductForm
          product={formMode === 'edit' ? editingProduct ?? undefined : undefined}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* ── Delete confirmation ── */}
      {deleteTarget && (
        <div className="product-manager__confirm">
          <ConfirmBar
            message={`Delete "${deleteTargetProduct?.name ?? 'this product'}"?`}
            confirmLabel="Yes, delete"
            cancelLabel="Keep"
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </div>
      )}

      {/* ── Table ── */}
      {products.length === 0 ? (
        <div className="product-manager__empty">
          <p>No products yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="product-manager__table-wrap">
          <table className="product-manager__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleRequestDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
