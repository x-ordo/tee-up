'use client';

import { forwardRef } from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-body-sm font-medium text-calm-charcoal">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-calm-ash">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              input w-full
              ${icon ? 'pl-12' : ''}
              ${
                error
                  ? 'border-error focus:border-error focus:ring-error/20'
                  : ''
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-body-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
