import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Input component with label, error, and helper text support
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const inputClassNames = [
      styles.input,
      error && styles.inputError,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const containerClassNames = [
      styles.container,
      fullWidth && styles.fullWidth,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClassNames}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClassNames}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [errorId, helperId].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className={styles.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
