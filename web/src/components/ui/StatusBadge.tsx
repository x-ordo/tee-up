import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * StatusBadge Design System
 *
 * 5 Core Semantic Categories:
 * - neutral: Default, inactive states
 * - success: Positive outcomes (approved, confirmed, completed)
 * - warning: Pending, attention needed (pending, disputed, escalated)
 * - error: Negative outcomes (rejected, cancelled)
 * - info: Informational, active states
 * - accent: Special emphasis (pro, admin, refunded)
 */
const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        // ===== Core Semantic Variants (5 categories) =====
        neutral: 'bg-tee-surface text-tee-ink-light border border-tee-stone',
        success: 'bg-tee-success/10 text-tee-success',
        warning: 'bg-tee-warning/10 text-tee-warning',
        error: 'bg-tee-error/10 text-tee-error',
        info: 'bg-tee-info/10 text-tee-info',
        accent: 'bg-tee-accent-primary/10 text-tee-accent-primary',
        'accent-gold': 'bg-tee-accent-secondary/10 text-tee-accent-secondary',
        // Solid variants for emphasis
        'pro-gold': 'bg-tee-accent-secondary text-white font-semibold',
        'pro-verified': 'bg-tee-accent-secondary text-white font-semibold',

        // ===== Backward Compatibility Aliases =====
        // Maps to 'neutral'
        default: 'bg-tee-surface text-tee-ink-light border border-tee-stone',
        golfer: 'bg-tee-surface text-tee-ink-light border border-tee-stone',
        member: 'bg-tee-stone text-tee-ink-light',
        cancelled: 'bg-tee-stone text-tee-ink-light',
        revoked: 'bg-tee-stone text-tee-ink-muted',

        // Maps to 'success'
        approved: 'bg-tee-success/10 text-tee-success',
        confirmed: 'bg-tee-success/10 text-tee-success',
        accepted: 'bg-tee-success/10 text-tee-success',

        // Maps to 'info' (completed is info, not success, for visual distinction)
        completed: 'bg-tee-info/10 text-tee-info',

        // Maps to 'warning'
        pending: 'bg-tee-warning/10 text-tee-warning',
        disputed: 'bg-tee-warning/10 text-tee-warning',
        escalated: 'bg-tee-warning/10 text-tee-warning',
        expired: 'bg-tee-warning/10 text-tee-warning',

        // Maps to 'error'
        rejected: 'bg-tee-error/10 text-tee-error',

        // Maps to 'info'
        active: 'bg-tee-info/10 text-tee-info',
        customer: 'bg-tee-info/10 text-tee-info',

        // Maps to 'accent'
        pro: 'bg-tee-accent-primary/10 text-tee-accent-primary',

        // Maps to 'accent-gold'
        refunded: 'bg-tee-accent-secondary/10 text-tee-accent-secondary',
        admin: 'bg-tee-accent-secondary/10 text-tee-accent-secondary',
        owner: 'bg-tee-accent-secondary/10 text-tee-accent-secondary',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
  icon?: 'check' | 'star' | 'shield';
}

const IconComponents = {
  check: (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  star: (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  shield: (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
};

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, size, dot, icon, children, ...props }, ref) => {
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
        {icon && (
          <span className="mr-1">{IconComponents[icon]}</span>
        )}
        {children}
      </span>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };
