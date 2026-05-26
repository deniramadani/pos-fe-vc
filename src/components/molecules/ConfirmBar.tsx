import React from 'react';
import { Button } from '../atoms';
import './ConfirmBar.css';

interface ConfirmBarProps {
  message:       string;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm:     () => void;
  onCancel:      () => void;
}

/**
 * Molecule — inline confirmation banner; replaces native window.confirm().
 * Appears in-context so the user never leaves the current view.
 * Composes: Button (atom)
 */
export const ConfirmBar: React.FC<ConfirmBarProps> = ({
  message,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  onConfirm,
  onCancel,
}) => (
  <div className="confirm-bar" role="alertdialog" aria-label={message}>
    <div className="confirm-bar__icon" aria-hidden="true">🗑️</div>
    <p className="confirm-bar__message">{message}</p>
    <div className="confirm-bar__actions">
      <Button variant="ghost"  size="sm" onClick={onCancel}  type="button">
        {cancelLabel}
      </Button>
      <Button variant="danger" size="sm" onClick={onConfirm} type="button">
        {confirmLabel}
      </Button>
    </div>
  </div>
);
