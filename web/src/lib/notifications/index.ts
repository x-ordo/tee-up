/**
 * Notification Service for TEE:UP
 * PRD v1.2: 간단 예약 요청 알림 시스템
 *
 * Sends notifications via:
 * 1. Kakao 알림톡 (primary, if configured)
 * 2. SMS (fallback)
 */

import { sendSMS, sendKakaoNotification, isSolapiConfigured } from './solapi';
import {
  getNewBookingRequestMessage,
  getBookingConfirmMessage,
  type BookingRequestNotificationData,
  type BookingConfirmNotificationData,
} from './templates';

export type NotificationResult = {
  success: boolean;
  channel?: 'kakao' | 'sms';
  messageId?: string;
  error?: string;
};

/**
 * Notify a pro about a new booking request
 */
export async function notifyProNewBookingRequest(
  proPhone: string,
  data: BookingRequestNotificationData
): Promise<NotificationResult> {
  if (!isSolapiConfigured()) {
    console.log('Notification service not configured. Skipping...');
    return {
      success: false,
      error: 'Notification service not configured',
    };
  }

  const message = getNewBookingRequestMessage(data);

  // Try Kakao first, then SMS
  const result = await sendKakaoNotification({
    to: proPhone,
    templateId: 'booking_request_new', // Template registered in SOLAPI
    variables: {
      proName: data.proName,
      requesterName: data.requesterName,
      requesterPhone: data.requesterPhone,
      preferredTime: data.preferredTime || '미지정',
      dashboardUrl: data.dashboardUrl,
    },
    fallbackSMS: message,
  });

  return {
    success: result.success,
    channel: result.success ? 'sms' : undefined, // Will be 'kakao' if Kakao succeeds
    messageId: result.messageId,
    error: result.error,
  };
}

/**
 * Notify student about booking confirmation
 */
export async function notifyStudentBookingConfirmed(
  studentPhone: string,
  data: BookingConfirmNotificationData
): Promise<NotificationResult> {
  if (!isSolapiConfigured()) {
    console.log('Notification service not configured. Skipping...');
    return {
      success: false,
      error: 'Notification service not configured',
    };
  }

  const message = getBookingConfirmMessage(data);

  const result = await sendSMS({
    to: studentPhone,
    text: message,
    type: 'LMS',
    subject: '[TEE:UP] 레슨 예약 확정',
  });

  return {
    success: result.success,
    channel: result.success ? 'sms' : undefined,
    messageId: result.messageId,
    error: result.error,
  };
}

/**
 * Send a simple notification message
 */
export async function sendNotification(
  phone: string,
  message: string
): Promise<NotificationResult> {
  if (!isSolapiConfigured()) {
    return {
      success: false,
      error: 'Notification service not configured',
    };
  }

  const result = await sendSMS({
    to: phone,
    text: message,
  });

  return {
    success: result.success,
    channel: result.success ? 'sms' : undefined,
    messageId: result.messageId,
    error: result.error,
  };
}

// Re-export utilities
export { isSolapiConfigured } from './solapi';
export * from './templates';
