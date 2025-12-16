import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, ...props }, ref) => {
    const id = useId(); // This was the problematic line for conditional rendering.

    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={id}
            className="mb-space-2 block text-body font-medium text-tee-ink-strong"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-full border border-tee-ink-light/20 bg-tee-surface px-space-4 py-space-2 text-body text-tee-ink-strong file:border-0 file:bg-transparent file:text-body file:font-medium placeholder:text-tee-ink-light focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-tee-background disabled:text-tee-ink-light',
            className,
            error && 'border-tee-error focus:ring-tee-error'
          )}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-space-2 text-caption text-tee-ink-light">{helperText}</p>
        )}
        {error && (
          <p className="mt-space-2 text-caption text-tee-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
