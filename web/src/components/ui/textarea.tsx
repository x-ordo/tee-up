import React, { useId } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'flex w-full rounded-xl border border-tee-ink-light/20 bg-tee-surface text-tee-ink-strong placeholder:text-tee-ink-light focus:border-tee-accent-primary focus:outline-none focus:ring-2 focus:ring-tee-accent-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-tee-background disabled:text-tee-ink-light transition-colors resize-none',
  {
    variants: {
      size: {
        sm: 'min-h-[80px] px-3 py-2 text-sm',
        default: 'min-h-[120px] px-space-4 py-space-3 text-body',
        lg: 'min-h-[160px] px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, size, ...props }, ref) => {
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
        <textarea
          id={id}
          className={cn(
            textareaVariants({ size }),
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
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
