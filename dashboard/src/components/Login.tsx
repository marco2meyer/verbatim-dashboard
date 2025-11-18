import { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: (password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      onLogin(password);
    } else {
      setError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rainbowBg}></div>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <img
            src="/verbatim_logo.png"
            alt="Verbatim"
            className={styles.logo}
          />
          <h1 className={styles.title}>City of London Corporation</h1>
          <p className={styles.subtitle}>Values Analysis Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Enter Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="Password"
              autoFocus
            />
            {error && (
              <span className={styles.errorText}>Please enter a password</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            <span className={styles.buttonText}>Access Dashboard</span>
            <span className={styles.buttonArrow}>→</span>
          </button>
        </form>

        <div className={styles.footer}>
          <div className={styles.rainbowDivider}></div>
        </div>
      </div>
    </div>
  );
}
