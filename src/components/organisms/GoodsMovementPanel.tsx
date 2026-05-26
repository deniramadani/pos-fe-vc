import React, { useState, useMemo } from 'react';
import { GoodsMovement, Product } from '../../types';
import { Badge, Modal } from '../atoms';
import { GoodsMovementForm } from '../molecules';
import './GoodsMovementPanel.css';

interface GoodsMovementPanelProps {
  type:      'in' | 'out';
  movements: GoodsMovement[];   /* pre-filtered by App to this type */
  products:  Product[];
  onSubmit:  (
    productId: string,
    quantity:  number,
    date:      Date,
    notes:     string,
  ) => void;
}

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

/**
 * Organism — full incoming-or-outgoing goods management panel.
 * Shared for both 'in' and 'out' via the `type` prop.
 * Composes: GoodsMovementForm (molecule) + Modal, Badge (atoms)
 */
export const GoodsMovementPanel: React.FC<GoodsMovementPanelProps> = ({
  type,
  movements,
  products,
  onSubmit,
}) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo,   setDateTo]   = useState('');
  const [selected, setSelected] = useState<GoodsMovement | null>(null);

  const isIn      = type === 'in';
  const icon      = isIn ? '📥' : '📤';
  const qtySign   = isIn ? '+' : '−';
  const badgeVar  = isIn ? 'navy' as const : 'red' as const;

  /* ── Date-filtered + sorted history ── */
  const filtered = useMemo(() => {
    return [...movements]
      .filter(m => {
        const d = new Date(m.date);
        if (dateFrom && d < new Date(dateFrom + 'T00:00:00')) return false;
        if (dateTo   && d > new Date(dateTo   + 'T23:59:59')) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, dateFrom, dateTo]);

  const clearFilters = () => { setDateFrom(''); setDateTo(''); };

  const handleFormSubmit = (data: {
    productId: string;
    quantity:  number;
    date:      Date;
    notes:     string;
  }) => {
    onSubmit(data.productId, data.quantity, data.date, data.notes);
  };

  return (
    <div className="gm-panel">

      {/* ── Panel header ── */}
      <div className="gm-panel__header">
        <div>
          <h2 className="gm-panel__title">{icon} {isIn ? 'Incoming Goods' : 'Outgoing Goods'}</h2>
          <p className="gm-panel__sub">
            {movements.length} record{movements.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* ── Entry form ── */}
      <section className="gm-panel__form-wrap">
        <h3 className="gm-panel__section-label">
          {isIn ? 'New Incoming Entry' : 'New Outgoing Entry'}
        </h3>
        <GoodsMovementForm
          type={type}
          products={products}
          onSubmit={handleFormSubmit}
        />
      </section>

      {/* ── History table ── */}
      <section className="gm-panel__history">
        <div className="gm-panel__history-header">
          <h3 className="gm-panel__section-label">History</h3>

          <div className="gm-panel__filters">
            <label className="gm-panel__filter-field">
              <span className="gm-panel__filter-label">From</span>
              <input
                type="date"
                className="gm-panel__date-input"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </label>
            <label className="gm-panel__filter-field">
              <span className="gm-panel__filter-label">To</span>
              <input
                type="date"
                className="gm-panel__date-input"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </label>
            {(dateFrom || dateTo) && (
              <button
                className="gm-panel__clear-btn"
                type="button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
            {filtered.length > 0 && (
              <span className="gm-panel__result-count">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="gm-panel__empty">
            {dateFrom || dateTo
              ? 'No records in the selected date range.'
              : `No ${isIn ? 'incoming' : 'outgoing'} records yet. Use the form above to add one.`}
          </div>
        ) : (
          <div className="gm-panel__table-wrap">
            <table className="gm-panel__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr
                    key={m.id}
                    className="gm-panel__row"
                    onClick={() => setSelected(m)}
                  >
                    <td className="gm-panel__col-date">{fmtDate(m.date)}</td>
                    <td className="gm-panel__col-product">{m.productName}</td>
                    <td className="gm-panel__col-qty">
                      <Badge variant={badgeVar}>
                        {qtySign}{m.quantity}
                      </Badge>
                    </td>
                    <td className="gm-panel__col-notes">
                      {m.notes || <span className="gm-panel__no-notes">—</span>}
                    </td>
                    <td className="gm-panel__col-action">
                      <span className="gm-panel__view-link">Details →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Detail modal ── */}
      {selected && (
        <Modal
          title={`${icon} ${isIn ? 'Incoming' : 'Outgoing'} — Details`}
          onClose={() => setSelected(null)}
          width="sm"
        >
          <dl className="gm-detail">
            <dt>Product</dt>
            <dd>{selected.productName}</dd>

            <dt>Quantity</dt>
            <dd>
              <Badge variant={badgeVar}>
                {qtySign}{selected.quantity} units
              </Badge>
            </dd>

            <dt>Date</dt>
            <dd>{fmtDate(selected.date)}</dd>

            <dt>Notes</dt>
            <dd className={selected.notes ? '' : 'gm-detail__muted'}>
              {selected.notes || 'No notes recorded'}
            </dd>

            <dt>Record&nbsp;ID</dt>
            <dd className="gm-detail__id">#{selected.id}</dd>
          </dl>
        </Modal>
      )}
    </div>
  );
};
