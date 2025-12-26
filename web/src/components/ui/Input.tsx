import React, { useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-full border border-tee-ink-light/20 bg-tee-surface text-tee-ink-strong file:border-0 file:bg-transparent file:font-medium placeholder:text-tee-ink-light focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-tee-background disabled:text-tee-ink-light transition-colors',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm',
        default: 'h-10 px-space-4 py-space-2 text-body',
        lg: 'h-12 px-5 text-lg',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, size, ...props }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    // Build aria-describedby based on what's present
    const describedBy = [
      error ? errorId : null,
      helperText && !error ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

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
            inputVariants({ size }),
            error && 'border-tee-error focus:ring-tee-error',
            className
          )}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        {helperText && !error && (
          <p id={helperId} className="mt-space-2 text-caption text-tee-ink-light">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="mt-space-2 text-caption text-tee-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
