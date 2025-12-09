import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, errorText, id, ...props }, ref) => {
    const inputId = id || React.useId(); // Generate unique ID if not provided

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-body font-medium text-tee-ink-strong uppercase">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-full border border-tee-ink-light/20 bg-tee-background px-3 py-2 text-body text-tee-ink-strong file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tee-ink-light/70 focus:border-tee-accent-primary focus:ring-1 focus:ring-tee-accent-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            errorText && 'border-functional-error focus:border-functional-error focus:ring-functional-error',
            className
          )}
          {...props}
        />
        {helperText && !errorText && (
          <p className="text-caption text-tee-ink-light">{helperText}</p>
        )}
        {errorText && (
          <p className="text-caption text-functional-error">{errorText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
