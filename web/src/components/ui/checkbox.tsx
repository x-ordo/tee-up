"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  error?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, error, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    aria-invalid={error ? true : undefined}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-md border border-tee-ink-light/30 bg-tee-surface shadow-sm transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tee-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-tee-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-tee-accent-primary data-[state=checked]:bg-tee-accent-primary data-[state=checked]:text-white",
      error && "border-tee-error focus-visible:ring-tee-error",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
