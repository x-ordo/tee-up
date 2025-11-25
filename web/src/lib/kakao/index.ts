/**
 * KakaoTalk Integration Utilities
 * @description 카카오톡 연동 관련 유틸리티 함수들
 */

import type { IKakaoShareContent, IKakaoButtonConfig } from '@/types';

// ============================================
// Constants
// ============================================

export const KAKAO_CHANNEL_ID = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID || '';
export const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';

// ============================================
// KakaoTalk Deep Link Utilities
// ============================================

/**
 * 카카오톡 채널 채팅 URL 생성
 * @param channelId - 카카오톡 채널 ID
 * @returns 채팅 URL
 */
export function getKakaoChannelChatUrl(channelId: string): string {
  return `https://pf.kakao.com/${channelId}/chat`;
}

/**
 * 카카오톡 채널 친구 추가 URL 생성
 * @param channelId - 카카오톡 채널 ID
 * @returns 친구 추가 URL
 */
export function getKakaoChannelAddUrl(channelId: string): string {
  return `https://pf.kakao.com/${channelId}`;
}

/**
 * 카카오톡 앱 딥링크 생성 (모바일)
 * @param channelId - 카카오톡 채널 ID
 * @returns 앱 딥링크 URL
 */
export function getKakaoAppDeepLink(channelId: string): string {
  return `kakaoplus://plusfriend/chat/${channelId}`;
}

/**
 * 플랫폼에 따른 적절한 URL 반환
 * @param channelId - 카카오톡 채널 ID
 * @returns 플랫폼별 URL
 */
export function getKakaoChatUrl(channelId: string): string {
  if (typeof window === 'undefined') {
    return getKakaoChannelChatUrl(channelId);
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // 모바일에서는 앱 딥링크 시도 후 웹 폴백
    return getKakaoAppDeepLink(channelId);
  }

  return getKakaoChannelChatUrl(channelId);
}

// ============================================
// Message Templates
// ============================================

export interface IKakaoMessageTemplate {
  type: 'inquiry' | 'booking_request' | 'booking_confirm';
  proName: string;
  golferName?: string;
  lessonType?: string;
  preferredDate?: string;
  message?: string;
}

/**
 * 레슨 문의 메시지 템플릿 생성
 */
export function createInquiryMessage(template: IKakaoMessageTemplate): string {
  const { proName, golferName = '골퍼', lessonType, message } = template;

  let text = `안녕하세요, ${proName} 프로님!\n\n`;
  text += `TEE:UP을 통해 문의드립니다.\n\n`;

  if (lessonType) {
    text += `관심 레슨: ${lessonType}\n`;
  }

  if (message) {
    text += `\n문의 내용:\n${message}\n`;
  }

  text += `\n- ${golferName} 드림`;

  return text;
}

/**
 * 레슨 예약 요청 메시지 템플릿 생성
 */
export function createBookingRequestMessage(template: IKakaoMessageTemplate): string {
  const { proName, golferName = '골퍼', lessonType, preferredDate } = template;

  let text = `안녕하세요, ${proName} 프로님!\n\n`;
  text += `레슨 예약을 요청드립니다.\n\n`;

  if (lessonType) {
    text += `레슨 유형: ${lessonType}\n`;
  }

  if (preferredDate) {
    text += `희망 일시: ${preferredDate}\n`;
  }

  text += `\n연락 부탁드립니다.\n`;
  text += `- ${golferName} 드림`;

  return text;
}

// ============================================
// Conversion Tracking
// ============================================

export interface IKakaoConversionEvent {
  event: 'kakao_chat_click' | 'kakao_channel_add' | 'kakao_share';
  proId?: string;
  proSlug?: string;
  source?: string;
}

/**
 * 카카오톡 전환 이벤트 추적
 */
export function trackKakaoConversion(eventData: IKakaoConversionEvent): void {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 이벤트
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventData.event, {
      pro_id: eventData.proId,
      pro_slug: eventData.proSlug,
      source: eventData.source,
    });
  }

  // 커스텀 이벤트 (내부 분석용)
  const customEvent = new CustomEvent('teeup_conversion', {
    detail: {
      type: 'kakao',
      ...eventData,
      timestamp: new Date().toISOString(),
    },
  });
  window.dispatchEvent(customEvent);

  // 콘솔 로그 (개발 환경)
  if (process.env.NODE_ENV === 'development') {
    console.log('[KakaoTalk Conversion]', eventData);
  }
}

// ============================================
// Share Utilities
// ============================================

/**
 * 카카오톡 공유 콘텐츠 생성
 */
export function createShareContent(
  proName: string,
  proSlug: string,
  imageUrl?: string
): IKakaoShareContent {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://teeup.golf';
  const proUrl = `${baseUrl}/profile/${proSlug}`;

  return {
    title: `${proName} 프로 - TEE:UP`,
    description: `TEE:UP에서 ${proName} 프로님의 프로필을 확인해보세요!`,
    imageUrl: imageUrl || `${baseUrl}/og-image.jpg`,
    link: {
      mobileWebUrl: proUrl,
      webUrl: proUrl,
    },
  };
}

/**
 * 카카오톡 공유 버튼 설정 생성
 */
export function createShareButtons(proSlug: string): IKakaoButtonConfig[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://teeup.golf';
  const proUrl = `${baseUrl}/profile/${proSlug}`;

  return [
    {
      title: '프로필 보기',
      link: {
        mobileWebUrl: proUrl,
        webUrl: proUrl,
      },
    },
  ];
}

// ============================================
// Type Declarations for Window
// ============================================

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
      Channel: {
        chat: (options: { channelPublicId: string }) => void;
        addChannel: (options: { channelPublicId: string }) => void;
      };
    };
  }
}
