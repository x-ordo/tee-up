import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const tagVariants = cva(
  'inline-flex items-center justify-center rounded-full px-space-2 py-px text-caption font-medium',
  {
    variants: {
      variant: {
        default: 'bg-tee-accent-secondary text-tee-ink-strong',
        // Add more variants as needed
        primary: 'bg-tee-accent-primary text-tee-surface',
        outline: 'border border-tee-ink-light/20 text-tee-ink-strong',
      },
      size: {
        md: 'h-6 px-space-2', // Adjust size as needed
        lg: 'h-8 px-space-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface TagProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
  // Any additional props specific to your Tag component
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(tagVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
