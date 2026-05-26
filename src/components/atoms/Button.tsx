import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'ghost-light';
export type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  fullWidth?: boolean;
}

/** Atom — the single interactive trigger in the system. */
export const Button: React.FC<ButtonProps> = ({
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}) => {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
};
