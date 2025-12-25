/**
 * Notification message templates for TEE:UP
 * PRD v1.2: 카카오 알림톡 및 SMS 메시지 템플릿
 */

export interface BookingRequestNotificationData {
  proName: string;
  requesterName: string;
  requesterPhone: string;
  preferredTime?: string;
  message?: string;
  dashboardUrl: string;
}

export interface BookingConfirmNotificationData {
  requesterName: string;
  proName: string;
  lessonTime: string;
  location?: string;
}

/**
 * Template for notifying pros about new booking requests
 */
export function getNewBookingRequestMessage(data: BookingRequestNotificationData): string {
  let message = `[TEE:UP] 새 레슨 문의\n\n`;
  message += `안녕하세요 ${data.proName}님,\n`;
  message += `새로운 레슨 문의가 접수되었습니다.\n\n`;
  message += `문의자: ${data.requesterName}\n`;
  message += `연락처: ${data.requesterPhone}\n`;

  if (data.preferredTime) {
    message += `희망 시간: ${data.preferredTime}\n`;
  }

  if (data.message) {
    message += `\n문의 내용:\n${data.message.substring(0, 100)}${data.message.length > 100 ? '...' : ''}\n`;
  }

  message += `\n지금 확인하기:\n${data.dashboardUrl}`;

  return message;
}

/**
 * Template for confirming booking to student
 */
export function getBookingConfirmMessage(data: BookingConfirmNotificationData): string {
  let message = `[TEE:UP] 레슨 예약 확정\n\n`;
  message += `${data.requesterName}님,\n`;
  message += `${data.proName} 프로님과의 레슨이 확정되었습니다.\n\n`;
  message += `일시: ${data.lessonTime}\n`;

  if (data.location) {
    message += `장소: ${data.location}\n`;
  }

  message += `\n좋은 레슨 되세요!`;

  return message;
}

/**
 * Template for reminder before lesson
 */
export function getLessonReminderMessage(data: {
  requesterName: string;
  proName: string;
  lessonTime: string;
  location?: string;
}): string {
  let message = `[TEE:UP] 레슨 알림\n\n`;
  message += `${data.requesterName}님,\n`;
  message += `오늘 ${data.proName} 프로님과 레슨이 예정되어 있습니다.\n\n`;
  message += `시간: ${data.lessonTime}\n`;

  if (data.location) {
    message += `장소: ${data.location}\n`;
  }

  return message;
}

/**
 * Truncate message for SMS (max 90 bytes for Korean)
 */
export function truncateForSMS(message: string, maxLength = 80): string {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength - 3) + '...';
}
