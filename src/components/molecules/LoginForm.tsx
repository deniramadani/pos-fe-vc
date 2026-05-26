import React, { useState } from 'react';
import { Button } from '../atoms';
import './LoginForm.css';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => boolean | Promise<boolean>;
  onGoogle?: (idToken: string) => boolean | Promise<boolean>;
}

/**
 * Molecule — sign-in form with loading state and inline error.
 * Composes: Button (atom)
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    /* brief artificial delay — feels less jarring than instant swap */
    await new Promise(r => setTimeout(r, 500));

    const ok = await onSubmit(username.trim(), password);
    if (!ok) {
      setError('Incorrect username or password. Please try again.');
    }
    setLoading(false);
  };

  /* Google Identity Services button */
  const googleButtonRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const existing = document.getElementById('gsi-client');
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.id = 'gsi-client';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
      s.onload = () => initGoogle();
    } else {
      initGoogle();
    }

    function initGoogle() {
      // @ts-ignore - google identity script
      if (window.google && googleButtonRef.current) {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp: any) => {
            const token = resp?.credential;
            if (token && onGoogle) {
              void (async () => {
                setLoading(true);
                const ok = await onGoogle(token);
                if (!ok) setError('Google sign-in failed');
                setLoading(false);
              })();
            }
          },
        });
        // @ts-ignore
        google.accounts.id.renderButton(googleButtonRef.current, { theme: 'filled_blue', size: 'large' });
      }
    }
  }, [onGoogle]);

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__header">
        <h1 className="login-form__title">Welcome back</h1>
        <p className="login-form__subtitle">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="login-form__error" role="alert">
          ⚠️ {error}
        </div>
      )}

      <div className="login-form__fields">
        {/* Username */}
        <label className="login-form__field">
          <span className="login-form__label">Email or username</span>
          <input
            className="login-form__input"
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            placeholder="Enter your email or username"
            autoComplete="username"
            autoFocus
            disabled={loading}
          />
        </label>

        {/* Password */}
        <label className="login-form__field">
          <span className="login-form__label">Password</span>
          <div className="login-form__password-wrap">
            <input
              className="login-form__input"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              className="login-form__toggle-pass"
              onClick={() => setShowPass(v => !v)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </label>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        type="submit"
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      {/* Google button target (rendered by Google Identity Services) */}
      <div className="login-form__google">
        <div className="login-form__google-btn" ref={googleButtonRef} />
      </div>

      {/* Demo hint */}
      <div className="login-form__hint">
        <p className="login-form__hint-title">Demo login</p>
        <div className="login-form__hint-row">
          <span className="login-form__hint-role">Admin</span>
          <code>admin</code> / <code>admin</code>
        </div>
        <div className="login-form__hint-row">
          <span className="login-form__hint-role">Cashier</span>
          <code>cashier</code> / <code>cashier</code>
        </div>
        <p className="login-form__hint-note">
          Or sign in with backend auth using your account email.
        </p>
      </div>
    </form>
  );
};
