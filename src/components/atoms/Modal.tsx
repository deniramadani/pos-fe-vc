import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  title?:   string;
  onClose:  () => void;
  children: React.ReactNode;
  width?:   'sm' | 'md' | 'lg';
}

/**
 * Atom — accessible overlay modal.
 * Closes on Escape key or backdrop click.
 */
export const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
  width = 'md',
}) => {
  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`modal modal--${width}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal__header">
          {title && <h3 className="modal__title">{title}</h3>}
          <button
            className="modal__close"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};
