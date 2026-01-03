'use client';

import { useState } from 'react';
import { signInWithKakao } from '@/lib/supabase/auth';

interface KakaoLoginButtonProps {
  /** URL to redirect after successful login */
  redirectTo?: string;
  /** Additional CSS classes */
  className?: string;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Kakao OAuth Login Button
 * Uses Supabase OAuth with Kakao provider
 */
export function KakaoLoginButton({
  redirectTo,
  className = '',
  fullWidth = true,
}: KakaoLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: oauthError } = await signInWithKakao(redirectTo);

      if (oauthError) {
        setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
        console.error('Kakao OAuth error:', oauthError);
      }
      // If successful, the page will redirect to Kakao OAuth
    } catch (err) {
      setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Kakao login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <button
        type="button"
        onClick={handleKakaoLogin}
        disabled={isLoading}
        className={`
          group relative flex items-center justify-center gap-3
          rounded-xl px-6 py-3.5 font-semibold
          transition-all duration-200
          hover:shadow-lg hover:brightness-95
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-70
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        style={{
          backgroundColor: '#FEE500',
          color: '#000000',
        }}
        aria-label="카카오로 로그인"
      >
        {/* Kakao Icon */}
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.627 1.697 4.934 4.256 6.264-.135.464-.87 2.983-.9 3.176 0 0-.019.154.082.213.1.06.218.027.218.027.288-.04 3.338-2.177 3.862-2.548.788.117 1.608.179 2.482.179 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
        </svg>

        <span className="relative z-10">
          {isLoading ? '로그인 중...' : '카카오로 시작하기'}
        </span>

        {/* Loading spinner overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/5">
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-center text-caption text-tee-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
