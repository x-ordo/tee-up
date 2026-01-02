'use client';

import { useCallback, useState } from 'react';
import { trackLead } from '@/actions/leads';

interface FloatingContactButtonProps {
  proId: string;
  proName: string;
  openChatUrl?: string | null;
  className?: string;
}

/**
 * Floating contact button (fixed at bottom-right)
 * Records lead and opens KakaoTalk chat
 */
export function FloatingContactButton({
  proId,
  proName,
  openChatUrl,
  className = '',
}: FloatingContactButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!openChatUrl) return;

    setIsLoading(true);

    try {
      // Track lead (fire and forget, don't block user)
      trackLead(proId, {
        contact_method: 'kakao',
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      }).catch(() => {
        // Silently ignore tracking errors
      });

      // Open KakaoTalk chat
      window.open(openChatUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  }, [proId, openChatUrl]);

  // Don't render if no chat URL configured
  if (!openChatUrl) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        fixed bottom-6 right-6 z-50
        flex h-14 w-14 items-center justify-center
        rounded-full shadow-lg
        transition-all duration-200
        hover:scale-110 hover:shadow-xl
        active:scale-95
        disabled:opacity-70 disabled:cursor-wait
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400
        motion-reduce:transition-none motion-reduce:hover:scale-100
        ${className}
      `}
      style={{
        backgroundColor: 'var(--brand-kakao, #FEE500)',
        color: 'var(--brand-kakao-text, #3C1E1E)',
      }}
      aria-label={`카카오톡으로 ${proName}에게 문의`}
    >
      {isLoading ? (
        <svg
          className="h-6 w-6 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
      ) : (
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.627 1.697 4.934 4.256 6.264-.135.464-.87 2.983-.9 3.176 0 0-.019.154.082.213.1.06.218.027.218.027.288-.04 3.338-2.177 3.862-2.548.788.117 1.608.179 2.482.179 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
        </svg>
      )}
    </button>
  );
}
