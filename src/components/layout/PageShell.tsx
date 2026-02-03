import React from 'react';
import styles from './PageShell.module.css';

export interface PageShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * PageShell component provides consistent layout structure
 * with optional header, footer, and sidebar
 */
export const PageShell: React.FC<PageShellProps> = ({
  children,
  header,
  footer,
  sidebar,
  maxWidth = 'xl',
}) => {
  return (
    <div className={styles.shell}>
      {header && <header className={styles.header}>{header}</header>}

      <div className={styles.wrapper}>
        {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}

        <main className={`${styles.main} ${styles[`maxWidth-${maxWidth}`]}`}>
          {children}
        </main>
      </div>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  );
};

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * PageHeader component for consistent page titles and descriptions
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderContent}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description && <p className={styles.pageDescription}>{description}</p>}
      </div>
      {actions && <div className={styles.pageActions}>{actions}</div>}
    </div>
  );
};
