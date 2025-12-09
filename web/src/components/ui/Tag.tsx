import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tagVariants = cva(
  'inline-flex items-center justify-center font-pretendard text-caption font-medium rounded-full px-2.5 py-0.5',
  {
    variants: {
      variant: {
        primary: 'bg-tee-accent-primary text-tee-surface',
        secondary: 'bg-tee-accent-secondary text-tee-ink-strong',
        info: 'bg-functional-info/10 text-functional-info',
        success: 'bg-functional-success/10 text-functional-success',
        warning: 'bg-functional-warning/10 text-functional-warning',
        error: 'bg-functional-error/10 text-functional-error',
      },
    },
    defaultVariants: {
      variant: 'secondary', // Default to accent-secondary as per requirements
    },
  }
);

interface TagProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
  asChild?: boolean;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'div';
    return (
      <Comp
        className={cn(tagVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
