import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statCardVariants = cva(
  'rounded-2xl border border-tee-ink-light/10 bg-tee-surface p-6 shadow-card transition-shadow hover:shadow-card-hover',
  {
    variants: {
      variant: {
        default: '',
        accent: 'border-tee-accent-primary/20 bg-gradient-to-br from-tee-accent-primary/5 to-transparent',
        warning: 'border-tee-warning/20 bg-gradient-to-br from-tee-warning/5 to-transparent',
        success: 'border-tee-success/20 bg-gradient-to-br from-tee-success/5 to-transparent',
        error: 'border-tee-error/20 bg-gradient-to-br from-tee-error/5 to-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant, label, value, change, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-testid="stat-card"
        className={cn(statCardVariants({ variant, className }))}
        {...props}
      >
        <div className="flex items-start justify-between">
          <p className="mb-2 text-sm font-medium text-tee-ink-muted">{label}</p>
          {icon && <div className="text-tee-ink-light">{icon}</div>}
        </div>
        <p className="mb-1 font-display text-3xl font-bold text-tee-ink-strong">
          {value}
        </p>
        {change && (
          <p className="text-xs text-tee-ink-light">{change}</p>
        )}
      </div>
    );
  }
);
StatCard.displayName = 'StatCard';

export { StatCard, statCardVariants };
