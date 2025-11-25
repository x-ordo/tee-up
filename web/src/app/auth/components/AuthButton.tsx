'use client';

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
  const baseStyles = `
    w-full rounded-lg px-6 py-3 text-base font-semibold
    transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] text-[#0a0e27]
      hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02]
      disabled:hover:scale-100 disabled:hover:shadow-none
    `,
    secondary: `
      border border-white/20 bg-transparent text-white
      hover:border-[#d4af37] hover:bg-[#d4af37]/10
    `,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin\" viewBox="0 0 24 24">
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
