import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-tee-surface text-tee-ink-light border border-tee-stone',
        active: 'bg-tee-info/10 text-tee-info',
        success: 'bg-tee-success/10 text-tee-success',
        warning: 'bg-tee-warning/10 text-tee-warning',
        error: 'bg-tee-error/10 text-tee-error',
        pending: 'bg-tee-warning/10 text-tee-warning',
        approved: 'bg-tee-success/10 text-tee-success',
        rejected: 'bg-tee-error/10 text-tee-error',
        pro: 'bg-tee-accent-primary/10 text-tee-accent-primary',
        golfer: 'bg-tee-surface text-tee-ink-light',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-testid="status-badge"
        className={cn(statusBadgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {children}
      </span>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };
