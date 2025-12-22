/**
 * Kakao Alimtalk (알림톡) Integration
 * 카카오 비즈니스 메시지 API를 통한 알림톡 발송
 *
 * 사용 전 필요한 환경변수:
 * - KAKAO_ALIMTALK_API_KEY: 카카오 비즈메시지 API 키
 * - KAKAO_ALIMTALK_SENDER_KEY: 발신 프로필 키
 * - KAKAO_ALIMTALK_PROFILE_KEY: 프로필 키 (선택)
 *
 * 템플릿 코드는 카카오 비즈니스 채널에서 등록 및 승인 필요
 */

// ============================================
// Types
// ============================================

export interface AlimtalkResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface AlimtalkButton {
  type: 'WL' | 'AL' | 'BK' | 'MD' | 'BC' | 'BT' | 'AC';
  name: string;
  linkMobile?: string;
  linkPc?: string;
  schemeIos?: string;
  schemeAndroid?: string;
}

export interface AlimtalkMessage {
  to: string; // 수신자 전화번호 (01012345678 형식)
  templateCode: string;
  variables: Record<string, string>;
  buttons?: AlimtalkButton[];
}

export interface AlimtalkTemplateCode {
  BOOKING_CONFIRMED: string;
  BOOKING_REMINDER_24H: string;
  BOOKING_CANCELLED: string;
  LESSON_COMPLETED: string;
  REFUND_COMPLETED: string;
  DISPUTE_RESOLVED: string;
}

// ============================================
// Template Codes (카카오 비즈니스 채널에서 등록 필요)
// ============================================

export const ALIMTALK_TEMPLATES: AlimtalkTemplateCode = {
  BOOKING_CONFIRMED: 'TEEUP_BOOKING_001',
  BOOKING_REMINDER_24H: 'TEEUP_BOOKING_002',
  BOOKING_CANCELLED: 'TEEUP_BOOKING_003',
  LESSON_COMPLETED: 'TEEUP_LESSON_001',
  REFUND_COMPLETED: 'TEEUP_REFUND_001',
  DISPUTE_RESOLVED: 'TEEUP_DISPUTE_001',
};

// ============================================
// Configuration
// ============================================

function getConfig() {
  const apiKey = process.env.KAKAO_ALIMTALK_API_KEY;
  const senderKey = process.env.KAKAO_ALIMTALK_SENDER_KEY;
  const apiUrl = process.env.KAKAO_ALIMTALK_API_URL || 'https://alimtalk-api.kakao.com/v2';

  return { apiKey, senderKey, apiUrl };
}

function isConfigured(): boolean {
  const { apiKey, senderKey } = getConfig();
  return !!(apiKey && senderKey);
}

// ============================================
// Core Functions
// ============================================

/**
 * 알림톡 메시지 발송
 */
export async function sendAlimtalk(message: AlimtalkMessage): Promise<AlimtalkResult> {
  if (!isConfigured()) {
    console.warn('[Alimtalk] API not configured. Message not sent.');
    return {
      success: false,
      error: '카카오 알림톡 API가 설정되지 않았습니다.',
    };
  }

  const { apiKey, senderKey, apiUrl } = getConfig();

  try {
    // 전화번호 정규화 (하이픈 제거)
    const phoneNumber = message.to.replace(/-/g, '');

    // API 요청 본문 구성
    const requestBody = {
      senderKey,
      templateCode: message.templateCode,
      recipientList: [
        {
          recipientNo: phoneNumber,
          templateParameter: message.variables,
          buttons: message.buttons || [],
        },
      ],
    };

    const response = await fetch(`${apiUrl}/alimtalk/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret-Key': apiKey!,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Alimtalk] API Error:', data);
      return {
        success: false,
        error: data.message || '알림톡 발송에 실패했습니다.',
      };
    }

    // 응답 처리
    const result = data.sendResults?.[0];
    if (result?.resultCode === '0') {
      return {
        success: true,
        messageId: result.messageId,
      };
    }

    return {
      success: false,
      error: result?.resultMessage || '알림톡 발송에 실패했습니다.',
    };
  } catch (error) {
    console.error('[Alimtalk] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알림톡 발송 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 대량 알림톡 발송 (최대 1000건)
 */
export async function sendBulkAlimtalk(
  messages: AlimtalkMessage[]
): Promise<{ success: boolean; results: AlimtalkResult[] }> {
  if (messages.length > 1000) {
    return {
      success: false,
      results: [{ success: false, error: '한 번에 최대 1000건까지만 발송 가능합니다.' }],
    };
  }

  const results = await Promise.all(messages.map(sendAlimtalk));

  return {
    success: results.every((r) => r.success),
    results,
  };
}

// ============================================
// Template Helper Functions
// ============================================

/**
 * 예약 확정 알림톡 발송
 */
export async function sendBookingConfirmedAlimtalk(params: {
  to: string;
  guestName: string;
  proName: string;
  lessonDate: string;
  lessonTime: string;
  location: string;
  price: string;
}): Promise<AlimtalkResult> {
  return sendAlimtalk({
    to: params.to,
    templateCode: ALIMTALK_TEMPLATES.BOOKING_CONFIRMED,
    variables: {
      guest_name: params.guestName,
      pro_name: params.proName,
      lesson_date: params.lessonDate,
      lesson_time: params.lessonTime,
      location: params.location,
      price: params.price,
    },
    buttons: [
      {
        type: 'WL',
        name: '예약 상세 보기',
        linkMobile: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings`,
        linkPc: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings`,
      },
    ],
  });
}

/**
 * 24시간 전 레슨 리마인더 알림톡 발송
 */
export async function sendBookingReminderAlimtalk(params: {
  to: string;
  guestName: string;
  proName: string;
  lessonDate: string;
  lessonTime: string;
  location: string;
}): Promise<AlimtalkResult> {
  return sendAlimtalk({
    to: params.to,
    templateCode: ALIMTALK_TEMPLATES.BOOKING_REMINDER_24H,
    variables: {
      guest_name: params.guestName,
      pro_name: params.proName,
      lesson_date: params.lessonDate,
      lesson_time: params.lessonTime,
      location: params.location,
    },
    buttons: [
      {
        type: 'WL',
        name: '예약 확인',
        linkMobile: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings`,
        linkPc: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings`,
      },
    ],
  });
}

/**
 * 예약 취소 알림톡 발송
 */
export async function sendBookingCancelledAlimtalk(params: {
  to: string;
  guestName: string;
  proName: string;
  lessonDate: string;
  lessonTime: string;
  refundAmount?: string;
}): Promise<AlimtalkResult> {
  return sendAlimtalk({
    to: params.to,
    templateCode: ALIMTALK_TEMPLATES.BOOKING_CANCELLED,
    variables: {
      guest_name: params.guestName,
      pro_name: params.proName,
      lesson_date: params.lessonDate,
      lesson_time: params.lessonTime,
      refund_amount: params.refundAmount || '0',
    },
  });
}

/**
 * 레슨 완료 후 후기 요청 알림톡
 */
export async function sendLessonCompletedAlimtalk(params: {
  to: string;
  guestName: string;
  proName: string;
  lessonDate: string;
  reviewUrl: string;
}): Promise<AlimtalkResult> {
  return sendAlimtalk({
    to: params.to,
    templateCode: ALIMTALK_TEMPLATES.LESSON_COMPLETED,
    variables: {
      guest_name: params.guestName,
      pro_name: params.proName,
      lesson_date: params.lessonDate,
    },
    buttons: [
      {
        type: 'WL',
        name: '후기 작성하기',
        linkMobile: params.reviewUrl,
        linkPc: params.reviewUrl,
      },
    ],
  });
}

/**
 * 환불 완료 알림톡
 */
export async function sendRefundCompletedAlimtalk(params: {
  to: string;
  guestName: string;
  refundAmount: string;
  refundDate: string;
}): Promise<AlimtalkResult> {
  return sendAlimtalk({
    to: params.to,
    templateCode: ALIMTALK_TEMPLATES.REFUND_COMPLETED,
    variables: {
      guest_name: params.guestName,
      refund_amount: params.refundAmount,
      refund_date: params.refundDate,
    },
  });
}

/**
 * 분쟁 해결 알림톡
 */
export async function sendDisputeResolvedAlimtalk(params: {
  to: string;
  guestName: string;
  resolution: string;
  refundAmount?: string;
}): Promise<AlimtalkResult> {
  return sendAlimtalk({
    to: params.to,
    templateCode: ALIMTALK_TEMPLATES.DISPUTE_RESOLVED,
    variables: {
      guest_name: params.guestName,
      resolution: params.resolution,
      refund_amount: params.refundAmount || '0',
    },
  });
}

// ============================================
// Utility Functions
// ============================================

/**
 * 전화번호 형식 검증
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/-/g, '');
  return /^01[0-9]{8,9}$/.test(cleaned);
}

/**
 * 날짜 포맷팅 (알림톡용)
 */
export function formatDateForAlimtalk(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

/**
 * 시간 포맷팅 (알림톡용)
 */
export function formatTimeForAlimtalk(date: Date): string {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
