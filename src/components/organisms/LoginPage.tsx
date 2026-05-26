import React from 'react';
import { LoginForm } from '../molecules';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean | Promise<boolean>;
  onGoogle?: (idToken: string) => boolean | Promise<boolean>;
}

/**
 * Organism / Page — full-screen login with split-panel layout.
 * Left: navy brand panel.  Right: LoginForm molecule.
 */
export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoogle }) => (
  <div className="login-page">
    {/* ── Left: brand panel ── */}
    <div className="login-page__brand" aria-hidden="true">
      <div className="login-page__brand-deco login-page__brand-deco--1" />
      <div className="login-page__brand-deco login-page__brand-deco--2" />
      <div className="login-page__brand-deco login-page__brand-deco--3" />

      <div className="login-page__brand-content">
        <span className="login-page__brand-icon">🛒</span>
        <h2 className="login-page__brand-name">POS-FE-VC</h2>
        <p className="login-page__brand-tagline">Fast · Accurate · Simple</p>

        <ul className="login-page__brand-features">
          <li>📦 Product management</li>
          <li>🧾 Real-time transactions</li>
          <li>📊 Back Office analytics</li>
        </ul>
      </div>

      <p className="login-page__brand-footer">
        Built with React &amp; TypeScript
      </p>
    </div>

    {/* ── Right: form panel ── */}
    <div className="login-page__form-panel">
      <LoginForm onSubmit={onLogin} onGoogle={onGoogle} />
    </div>
  </div>
);
