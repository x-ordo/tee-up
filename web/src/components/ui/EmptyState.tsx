import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-testid="empty-state"
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-tee-stone bg-tee-surface/50 p-12 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-4xl text-tee-ink-muted">{icon}</div>
        )}
        <h3 className="mb-2 text-lg font-semibold text-tee-ink-strong">
          {title}
        </h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-tee-ink-light">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
