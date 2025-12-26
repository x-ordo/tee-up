import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Card variants using CVA (Class Variance Authority)
 *
 * @example
 * // Use with Tailwind classes
 * className={cardVariants({ variant: 'elevated' })}
 */
const cardVariants = cva(
  'rounded-xl border bg-tee-surface text-tee-ink-strong',
  {
    variants: {
      /**
       * Visual style variants
       * - `default`: Standard card with subtle shadow
       * - `elevated`: Higher elevation with larger shadow
       * - `interactive`: Clickable card with hover effects
       * - `outline`: Border only, no shadow or background
       */
      variant: {
        default: 'border-tee-ink-light/10 shadow-card',
        elevated: 'border-tee-ink-light/10 shadow-lg',
        interactive:
          'border-tee-ink-light/10 shadow-card transition-all duration-200 hover:shadow-lg hover:border-tee-accent-primary/30 cursor-pointer',
        outline: 'border-tee-stone bg-transparent shadow-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Card component props
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * A container component for grouping related content.
 *
 * Cards support multiple variants for different visual treatments.
 * Use with CardHeader, CardContent, CardFooter for structured layouts.
 *
 * @example
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 * </Card>
 *
 * @example
 * // Interactive card (clickable)
 * <Card variant="interactive" onClick={handleClick}>
 *   <CardContent>Click me!</CardContent>
 * </Card>
 *
 * @example
 * // Elevated card for emphasis
 * <Card variant="elevated">
 *   <CardContent>Important content</CardContent>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { cardVariants };

/**
 * Card header section containing title and description.
 *
 * @example
 * <CardHeader>
 *   <CardTitle>My Card</CardTitle>
 *   <CardDescription>Optional description</CardDescription>
 * </CardHeader>
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * Card title component, typically used within CardHeader.
 *
 * @example
 * <CardTitle>Dashboard Overview</CardTitle>
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * Card description component for secondary text.
 *
 * @example
 * <CardDescription>
 *   A brief explanation of the card's purpose
 * </CardDescription>
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-tee-ink-light', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * Card content section for the main body.
 *
 * @example
 * <CardContent>
 *   <p>Main content goes here</p>
 * </CardContent>
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * Card footer section, typically for actions.
 *
 * @example
 * <CardFooter>
 *   <Button>Save</Button>
 *   <Button variant="outline">Cancel</Button>
 * </CardFooter>
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
