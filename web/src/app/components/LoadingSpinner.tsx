'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

/**
 * 공유 로딩 스피너 컴포넌트
 *
 * @param message - 로딩 중 표시할 메시지 (기본값: "로딩 중...")
 * @param size - 스피너 크기 (sm: 8, md: 16, lg: 20)
 * @param fullScreen - 전체 화면 배경 표시 여부
 *
 * @example
 * // 기본 사용
 * <LoadingSpinner />
 *
 * // 커스텀 메시지와 크기
 * <LoadingSpinner message="결제 처리 중..." size="lg" />
 *
 * // 전체 화면 로딩
 * <LoadingSpinner fullScreen message="페이지 로딩 중..." />
 */
export function LoadingSpinner({
  message = '로딩 중...',
  size = 'md',
  fullScreen = true
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };

  const content = (
    <div
      className="text-center"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className={`mx-auto mb-6 animate-spin rounded-full border-4 border-accent border-t-transparent ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      {message && <p className="text-calm-ash">{message}</p>}
      <span className="sr-only">{message || '로딩 중'}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-calm-white">
        {content}
      </div>
    );
  }

  return content;
}

// Button with loading state for actions
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText = '처리 중...',
  variant = 'primary',
  children,
  disabled,
  className = '',
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  };

  return (
    <button
      disabled={loading || disabled}
      className={`${variantClasses[variant]} relative inline-flex items-center justify-center gap-2 ${className}`}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          aria-hidden="true"
        />
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
      {loading && (
        <span className="sr-only">{loadingText}</span>
      )}
    </button>
  );
}

export default LoadingSpinner;
