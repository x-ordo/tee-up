import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists for combining class names

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'div'; // Card is always a div unless asChild provides another component
    return (
      <Comp
        className={cn(
          'bg-tee-surface border border-tee-ink-light/10 rounded-xl shadow-card p-4 transition-all duration-200 ease-in-out',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export { Card };
