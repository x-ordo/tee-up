/**
 * SOLAPI Client for SMS and Kakao notifications
 * PRD v1.2: 간단 예약 요청 알림 시스템
 *
 * Environment variables required:
 * - SOLAPI_API_KEY
 * - SOLAPI_API_SECRET
 * - SOLAPI_SENDER_PHONE (registered sender number)
 * - SOLAPI_PFID (Kakao Channel PFID, optional)
 */

import crypto from 'crypto';

const SOLAPI_API_URL = 'https://api.solapi.com';

interface SolapiConfig {
  apiKey: string;
  apiSecret: string;
  senderPhone: string;
  pfid?: string; // Kakao Channel Profile ID
}

interface SendMessageParams {
  to: string;
  text: string;
  type?: 'SMS' | 'LMS' | 'ATA'; // SMS, LMS, 알림톡
  templateId?: string; // For Kakao ATA
  subject?: string; // For LMS
}

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function getConfig(): SolapiConfig | null {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const senderPhone = process.env.SOLAPI_SENDER_PHONE;

  if (!apiKey || !apiSecret || !senderPhone) {
    return null;
  }

  return {
    apiKey,
    apiSecret,
    senderPhone,
    pfid: process.env.SOLAPI_PFID,
  };
}

function generateSignature(apiKey: string, apiSecret: string): {
  Authorization: string;
  timestamp: string;
  salt: string;
} {
  const timestamp = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString('hex');
  const data = timestamp + salt;
  const hmac = crypto.createHmac('sha256', apiSecret);
  hmac.update(data);
  const signature = hmac.digest('hex');

  return {
    Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${timestamp}, salt=${salt}, signature=${signature}`,
    timestamp,
    salt,
  };
}

/**
 * Send SMS or LMS message via SOLAPI
 */
export async function sendSMS(params: SendMessageParams): Promise<SendMessageResult> {
  const config = getConfig();

  if (!config) {
    console.warn('SOLAPI not configured. Skipping SMS notification.');
    return {
      success: false,
      error: 'SOLAPI not configured',
    };
  }

  try {
    const { Authorization } = generateSignature(config.apiKey, config.apiSecret);

    // Determine message type based on length (SMS: 90 bytes, LMS: 2000 bytes)
    const textByteLength = Buffer.byteLength(params.text, 'utf8');
    const messageType = params.type || (textByteLength > 90 ? 'LMS' : 'SMS');

    const message: Record<string, unknown> = {
      to: params.to.replace(/-/g, ''), // Remove dashes
      from: config.senderPhone,
      text: params.text,
      type: messageType,
    };

    if (messageType === 'LMS' && params.subject) {
      message.subject = params.subject;
    }

    const response = await fetch(`${SOLAPI_API_URL}/messages/v4/send`, {
      method: 'POST',
      headers: {
        Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('SOLAPI error:', result);
      return {
        success: false,
        error: result.message || 'Failed to send message',
      };
    }

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('SOLAPI send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Kakao 알림톡 (ATA) via SOLAPI
 * Requires registered template and Kakao Channel
 */
export async function sendKakaoNotification(params: {
  to: string;
  templateId: string;
  variables?: Record<string, string>;
  fallbackSMS?: string;
}): Promise<SendMessageResult> {
  const config = getConfig();

  if (!config || !config.pfid) {
    console.warn('SOLAPI Kakao not configured. Falling back to SMS.');
    if (params.fallbackSMS) {
      return sendSMS({ to: params.to, text: params.fallbackSMS });
    }
    return {
      success: false,
      error: 'SOLAPI Kakao not configured',
    };
  }

  try {
    const { Authorization } = generateSignature(config.apiKey, config.apiSecret);

    const message: Record<string, unknown> = {
      to: params.to.replace(/-/g, ''),
      from: config.senderPhone,
      kakaoOptions: {
        pfId: config.pfid,
        templateId: params.templateId,
        variables: params.variables || {},
      },
    };

    const response = await fetch(`${SOLAPI_API_URL}/messages/v4/send`, {
      method: 'POST',
      headers: {
        Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('SOLAPI Kakao error:', result);
      // Fallback to SMS if Kakao fails
      if (params.fallbackSMS) {
        console.log('Falling back to SMS...');
        return sendSMS({ to: params.to, text: params.fallbackSMS });
      }
      return {
        success: false,
        error: result.message || 'Failed to send Kakao notification',
      };
    }

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('SOLAPI Kakao send error:', error);
    // Fallback to SMS on error
    if (params.fallbackSMS) {
      return sendSMS({ to: params.to, text: params.fallbackSMS });
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if SOLAPI is configured
 */
export function isSolapiConfigured(): boolean {
  return getConfig() !== null;
}

/**
 * Check if Kakao 알림톡 is configured
 */
export function isKakaoConfigured(): boolean {
  const config = getConfig();
  return config !== null && !!config.pfid;
}
