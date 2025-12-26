'use client';

import { cn } from '@/lib/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function AuthButton({
  isLoading = false,
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: AuthButtonProps) {
  const baseClasses =
    'w-full h-12 rounded-xl font-medium text-body transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: cn(
      baseClasses,
      'bg-tee-accent-primary text-white',
      'hover:bg-tee-accent-primary-hover',
      'active:bg-tee-accent-primary-active',
      'disabled:bg-tee-accent-primary-disabled',
      'focus:ring-tee-accent-primary'
    ),
    secondary: cn(
      baseClasses,
      'bg-tee-surface text-tee-ink-strong border border-tee-stone',
      'hover:bg-tee-background',
      'active:bg-tee-stone',
      'disabled:bg-tee-background disabled:text-tee-ink-muted',
      'focus:ring-tee-accent-primary'
    ),
  };

  return (
    <button
      className={cn(variantClasses[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          처리 중...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
