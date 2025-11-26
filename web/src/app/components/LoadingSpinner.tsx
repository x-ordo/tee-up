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
    <div className="text-center">
      <div
        className={`mx-auto mb-6 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent ${sizeClasses[size]}`}
      />
      {message && <p className="text-white/60">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
        {content}
      </div>
    );
  }

  return content;
}

export default LoadingSpinner;
