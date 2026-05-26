import React, { useEffect } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
  id:       string;
  message:  string;
  sub?:     string;       /* optional secondary line */
  type?:    ToastType;
  duration?: number;
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
};

/**
 * Atom — auto-dismissing notification with progress bar.
 * Mount it; it self-dismisses after `duration` ms via onDismiss callback.
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  sub,
  type     = 'success',
  duration = 3500,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      className={`toast toast--${type}`}
      role="status"
      aria-live="polite"
      style={{ '--toast-duration': `${duration}ms` } as React.CSSProperties}
    >
      <span className="toast__icon" aria-hidden="true">
        {ICONS[type]}
      </span>

      <div className="toast__body">
        <p className="toast__message">{message}</p>
        {sub && <p className="toast__sub">{sub}</p>}
      </div>

      <button
        className="toast__close"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        type="button"
      >
        ×
      </button>

      {/* shrinking progress bar driven by CSS animation */}
      <div className="toast__progress" aria-hidden="true" />
    </div>
  );
};
