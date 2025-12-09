import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Assuming cn utility exists for combining class names

// Define button variants using class-variance-authority (cva)
const buttonVariants = cva(
  'inline-flex items-center justify-center font-pretendard font-medium uppercase transition-all duration-150 ease-in-out',
  {
    variants: {
      variant: {
        primary: 'bg-tee-accent-primary text-tee-surface border border-tee-accent-primary shadow-sm hover:bg-tee-accent-primary-hover hover:border-tee-accent-primary-hover active:bg-tee-accent-primary-active active:border-tee-accent-primary-active disabled:bg-tee-accent-primary-disabled disabled:border-tee-accent-primary-disabled disabled:cursor-not-allowed',
        secondary: 'bg-tee-background text-tee-ink-strong border border-tee-ink-light/20 hover:border-tee-accent-primary hover:text-tee-accent-primary disabled:border-tee-ink-light/20 disabled:text-tee-ink-light disabled:cursor-not-allowed',
        ghost: 'bg-transparent text-tee-ink-strong border border-transparent hover:bg-tee-background disabled:text-tee-ink-light disabled:cursor-not-allowed',
      },
      size: {
        md: 'h-10 px-4 py-2 text-body rounded-full', // 40px height
        lg: 'h-12 px-6 py-3 text-h3 rounded-full', // 48px height
      },
      withIcon: {
        true: 'gap-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, withIcon, asChild = false, ...props }, ref) => {
    // If asChild is true, it renders the child component (e.g., Link) with the button styles
    // Otherwise, it renders a standard button element
    const Comp = asChild ? 'div' : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, withIcon, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
