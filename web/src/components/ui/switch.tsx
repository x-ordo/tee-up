'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

/**
 * A toggle switch component built on Radix UI Switch.
 *
 * Provides an accessible on/off toggle with keyboard and screen reader support.
 *
 * @example
 * // Basic switch
 * <Switch />
 *
 * @example
 * // With label
 * <div className="flex items-center gap-3">
 *   <Switch id="notifications" />
 *   <label htmlFor="notifications">Enable notifications</label>
 * </div>
 *
 * @example
 * // Controlled switch
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 *
 * @example
 * // Disabled state
 * <Switch disabled />
 *
 * @example
 * // In a settings form
 * <div className="flex items-center justify-between">
 *   <div>
 *     <p className="font-medium">Dark Mode</p>
 *     <p className="text-sm text-muted">Enable dark theme</p>
 *   </div>
 *   <Switch checked={darkMode} onCheckedChange={setDarkMode} />
 * </div>
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tee-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-tee-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-tee-accent-primary data-[state=unchecked]:bg-tee-stone',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
        'data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-1'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
