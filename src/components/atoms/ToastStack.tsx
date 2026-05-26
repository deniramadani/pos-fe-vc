import React from 'react';
import { Toast, ToastData } from './Toast';
import './Toast.css';

interface ToastStackProps {
  toasts:    ToastData[];
  onDismiss: (id: string) => void;
}

/**
 * Atom — renders a stacked list of Toast notifications.
 * Mount once at the root; pass `toasts` array managed from App state.
 */
export const ToastStack: React.FC<ToastStackProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-label="Notifications">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
