import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logoSection}>
            <Link to="/">
              <img
                src="/verbatim_logo.png"
                alt="Verbatim"
                className={styles.logo}
              />
            </Link>
            <div className={styles.titleSection}>
              <h1 className={styles.appTitle}>City of London Corporation Demo Dashboard</h1>
              <p className={styles.subtitle}>Values Analysis Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}
