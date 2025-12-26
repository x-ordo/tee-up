import React, { useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Input variants using CVA (Class Variance Authority)
 *
 * @example
 * // Use with Tailwind classes
 * className={inputVariants({ size: 'lg' })}
 */
const inputVariants = cva(
  'flex w-full rounded-full border border-tee-ink-light/20 bg-tee-surface text-tee-ink-strong file:border-0 file:bg-transparent file:font-medium placeholder:text-tee-ink-light focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-tee-background disabled:text-tee-ink-light transition-colors',
  {
    variants: {
      /**
       * Size variants
       * - `sm`: Small input (32px height)
       * - `default`: Standard input (40px height)
       * - `lg`: Large input (48px height)
       */
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

/**
 * Input component props
 */
interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label text displayed above the input
   * Automatically connected via htmlFor/id
   */
  label?: string;

  /**
   * Helper text displayed below the input
   * Hidden when error is present
   */
  helperText?: string;

  /**
   * Error message displayed below the input
   * Triggers error styling and aria-invalid
   */
  error?: string;
}

/**
 * An accessible text input component with built-in label and error handling.
 *
 * Features:
 * - Auto-generated IDs for label/input association
 * - aria-invalid and aria-describedby for accessibility
 * - Error messages announced via role="alert"
 * - CVA-based size variants
 *
 * @example
 * // Basic input
 * <Input placeholder="Enter your name" />
 *
 * @example
 * // With label and helper text
 * <Input
 *   label="Email"
 *   helperText="We'll never share your email"
 *   type="email"
 * />
 *
 * @example
 * // With error state
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 *
 * @example
 * // Different sizes
 * <Input size="sm" placeholder="Small" />
 * <Input size="default" placeholder="Default" />
 * <Input size="lg" placeholder="Large" />
 */
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
