'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    const inputId = props.id || props.name;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-body font-medium text-tee-ink-strong">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-tee-ink-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              // Base styles
              'flex h-12 w-full rounded-xl border bg-tee-surface px-4 py-3 text-body text-tee-ink-strong',
              'placeholder:text-tee-ink-muted',
              'transition-colors duration-fast',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2',
              // Default border
              'border-tee-stone',
              // Disabled styles
              'disabled:cursor-not-allowed disabled:bg-tee-background disabled:text-tee-ink-light',
              // Autofill override - prevent browser's blue/yellow background
              '[&:-webkit-autofill]:bg-tee-surface',
              '[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]',
              '[&:-webkit-autofill]:[-webkit-text-fill-color:var(--tee-ink-strong)]',
              // Icon padding
              icon && 'pl-12',
              // Error styles
              error && 'border-tee-error focus:ring-tee-error',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-caption text-tee-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
