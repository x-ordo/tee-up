import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-tee-accent-primary text-tee-surface shadow hover:bg-tee-accent-primary-hover',
        destructive:
          'bg-tee-error text-tee-surface shadow-sm hover:bg-tee-error/90',
        outline:
          'border border-tee-ink-light/20 bg-transparent shadow-sm hover:bg-tee-background hover:text-tee-accent-primary',
        secondary:
          'bg-tee-background text-tee-ink-strong shadow-sm hover:bg-tee-stone-50',
        ghost: 'hover:bg-tee-background hover:text-tee-accent-primary',
        link: 'text-tee-accent-primary underline-offset-4 hover:underline',
        // Legacy variants for backward compatibility
        primary:
          'bg-tee-accent-primary text-tee-surface border border-tee-accent-primary shadow-sm hover:bg-tee-accent-primary-hover hover:border-tee-accent-primary-hover active:bg-tee-accent-primary-active active:border-tee-accent-primary-active disabled:bg-tee-accent-primary-disabled disabled:border-tee-accent-primary-disabled',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        // Legacy sizes
        md: 'h-10 px-4 py-2 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
