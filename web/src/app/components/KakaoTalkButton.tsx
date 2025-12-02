'use client';

import { useCallback } from 'react';
import {
  getKakaoChatUrl,
  getKakaoChannelChatUrl,
  getKakaoAppDeepLink,
  trackKakaoConversion,
} from '@/lib/kakao';

interface KakaoTalkButtonProps {
  kakaoTalkId: string;
  proName: string;
  proId?: string;
  proSlug?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  trackingSource?: string;
}

export function KakaoTalkButton({
  kakaoTalkId,
  proName,
  proId,
  proSlug,
  variant = 'primary',
  size = 'md',
  className = '',
  trackingSource = 'profile',
}: KakaoTalkButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // 전환 추적
      trackKakaoConversion({
        event: 'kakao_chat_click',
        proId,
        proSlug,
        source: trackingSource,
      });

      // 모바일에서 앱 딥링크 시도
      if (typeof window !== 'undefined') {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          e.preventDefault();
          const appLink = getKakaoAppDeepLink(kakaoTalkId);
          const webLink = getKakaoChannelChatUrl(kakaoTalkId);

          // 앱 열기 시도
          window.location.href = appLink;

          // 앱이 없으면 웹으로 폴백
          setTimeout(() => {
            window.location.href = webLink;
          }, 1500);
        }
      }
    },
    [kakaoTalkId, proId, proSlug, trackingSource]
  );

  const kakaoUrl = getKakaoChatUrl(kakaoTalkId);

  // 사이즈별 스타일 (디자인 시스템 spacing 적용)
  const sizeStyles = {
    sm: 'px-4 py-2 text-body-sm',
    md: 'px-6 py-3 text-body-md',
    lg: 'px-8 py-4 text-body-lg',
  };

  // 변형별 스타일 (카카오톡 브랜드 색상 유지, 디자인 시스템과 조화)
  const variantStyles = {
    primary: `
      border-2 border-accent bg-white text-accent
      hover:bg-accent hover:text-white
      hover:shadow-glow-accent
    `,
    secondary: `
      border-2 border-calm-stone bg-white text-calm-charcoal
      hover:border-accent hover:text-accent
    `,
    minimal: `
      border-none hover:shadow-lg
    `,
  };

  // Minimal variant needs inline styles for CSS variables
  const minimalStyles = variant === 'minimal' ? {
    backgroundColor: 'var(--brand-kakao)',
    color: 'var(--brand-kakao-text)',
  } : {};

  return (
    <a
      href={kakaoUrl}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative inline-flex items-center justify-center gap-2 overflow-hidden
        rounded-full font-semibold shadow-md
        transition-all duration-base hover:scale-105
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      style={minimalStyles}
      aria-label={`카카오톡으로 ${proName}에게 문의`}
    >
      {/* 카카오톡 아이콘 */}
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.627 1.697 4.934 4.256 6.264-.135.464-.87 2.983-.9 3.176 0 0-.019.154.082.213.1.06.218.027.218.027.288-.04 3.338-2.177 3.862-2.548.788.117 1.608.179 2.482.179 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
      </svg>
      <span className="relative z-10">카카오톡으로 문의</span>
    </a>
  );
}

// 카카오톡 채널 추가 버튼
interface KakaoChannelAddButtonProps {
  channelId: string;
  className?: string;
}

export function KakaoChannelAddButton({
  channelId,
  className = '',
}: KakaoChannelAddButtonProps) {
  const handleClick = useCallback(() => {
    trackKakaoConversion({
      event: 'kakao_channel_add',
      source: 'channel_add_button',
    });
  }, []);

  const channelUrl = `https://pf.kakao.com/${channelId}`;

  return (
    <a
      href={channelUrl}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2 rounded-lg px-4 py-2
        text-sm font-medium transition-all duration-200
        hover:shadow-md
        ${className}
      `}
      style={{
        backgroundColor: 'var(--brand-kakao)',
        color: 'var(--brand-kakao-text)',
      }}
      aria-label="카카오톡 채널 추가"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.627 1.697 4.934 4.256 6.264-.135.464-.87 2.983-.9 3.176 0 0-.019.154.082.213.1.06.218.027.218.027.288-.04 3.338-2.177 3.862-2.548.788.117 1.608.179 2.482.179 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
      </svg>
      채널 추가
    </a>
  );
}
