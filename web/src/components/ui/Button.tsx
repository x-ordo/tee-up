import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button variants using CVA (Class Variance Authority)
 *
 * @example
 * // Use with Tailwind classes
 * className={buttonVariants({ variant: 'outline', size: 'lg' })}
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      /**
       * Visual style variants
       * - `default`: Primary filled button (forest green)
       * - `destructive`: Error/danger actions (red)
       * - `outline`: Bordered, transparent background
       * - `secondary`: Subtle, light background
       * - `ghost`: No background, hover effect only
       * - `link`: Text link style with underline
       * - `primary`: Legacy alias for default
       */
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
      /**
       * Size variants (WCAG 2.2 compliant touch targets)
       * - `default`: Standard size (44px height - WCAG minimum)
       * - `sm`: Small size (36px height - desktop only)
       * - `lg`: Large size (48px height)
       * - `icon`: Square icon button (44x44px)
       * - `md`: Legacy medium with rounded-full
       */
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8',
        icon: 'h-11 w-11',
        // Legacy sizes
        md: 'h-11 px-4 py-2 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Button component props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the button will render as a Slot component,
   * allowing the child element to be the rendered element.
   * Useful for rendering links styled as buttons.
   *
   * @default false
   * @example
   * <Button asChild>
   *   <Link href="/dashboard">Go to Dashboard</Link>
   * </Button>
   */
  asChild?: boolean;
}

/**
 * A versatile button component with multiple variants and sizes.
 *
 * Built on Radix UI Slot for polymorphic rendering support.
 * Uses CVA for type-safe variant management.
 *
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 *
 * @example
 * // With variants
 * <Button variant="outline" size="lg">
 *   Large Outline Button
 * </Button>
 *
 * @example
 * // As a link
 * <Button asChild variant="ghost">
 *   <Link href="/about">About</Link>
 * </Button>
 *
 * @example
 * // Icon button
 * <Button variant="ghost" size="icon">
 *   <MenuIcon className="h-4 w-4" />
 * </Button>
 *
 * @example
 * // Disabled state
 * <Button disabled>Cannot Click</Button>
 */
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
