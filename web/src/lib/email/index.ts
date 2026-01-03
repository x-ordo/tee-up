/**
 * Email Service
 * TEE:UP Portfolio SaaS
 *
 * Abstraction layer for email sending.
 * Currently supports console logging (dev) and can be extended for Resend/SendGrid.
 */

// ============================================================
// Types
// ============================================================

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================================
// Email Provider Interface
// ============================================================

type EmailProvider = (options: EmailOptions) => Promise<EmailResult>;

// ============================================================
// Console Provider (Development)
// ============================================================

const consoleProvider: EmailProvider = async (options) => {
  console.log('[Email] Sending email:');
  console.log('  To:', options.to);
  console.log('  Subject:', options.subject);
  console.log('  From:', options.from || 'noreply@teeup.golf');
  console.log('  Content:', options.text || options.html.substring(0, 200) + '...');

  return {
    success: true,
    messageId: `dev-${Date.now()}`,
  };
};

// ============================================================
// Resend Provider (Production)
// ============================================================

const resendProvider: EmailProvider = async (options) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('[Email] RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: options.from || 'TEE:UP <noreply@teeup.golf>',
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
        tags: options.tags?.map((tag) => ({ name: tag, value: 'true' })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('[Email] Failed to send via Resend:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// ============================================================
// Main Send Function
// ============================================================

const getProvider = (): EmailProvider => {
  if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
    return consoleProvider;
  }
  return resendProvider;
};

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const provider = getProvider();
  return provider(options);
}

// ============================================================
// Retargeting Email Templates
// ============================================================

interface RetargetingEmailData {
  userName?: string;
  proName?: string;
  proSlug?: string;
  proImage?: string;
  ctaUrl: string;
  unsubscribeUrl: string;
}

export function generateRetargetingEmail(
  templateId: string,
  data: RetargetingEmailData
): { subject: string; html: string; text: string } {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://teeup.golf';
  const userName = data.userName || '고객';

  const templates: Record<string, { subject: string; content: string }> = {
    quiz_abandon: {
      subject: '아직 완료되지 않은 프로 매칭이 있어요!',
      content: `
        <p>${userName}님, 맞춤 프로를 찾기 위한 퀴즈가 아직 완료되지 않았어요.</p>
        <p>지금 이어서 진행하면 딱 맞는 프로 3명을 추천받을 수 있어요!</p>
        <p style="margin-top: 24px;">
          <a href="${data.ctaUrl}" style="background-color: #0A362B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            퀴즈 이어하기
          </a>
        </p>
      `,
    },
    form_abandon: {
      subject: `${data.proName || '프로'}에게 상담 신청이 대기 중이에요`,
      content: `
        <p>${userName}님, ${data.proName || '선택하신 프로'}에게 상담을 신청하려고 하셨나요?</p>
        <p>지금 바로 상담을 완료하고 빠른 답변을 받아보세요.</p>
        ${
          data.proImage
            ? `<img src="${data.proImage}" alt="${data.proName}" style="width: 80px; height: 80px; border-radius: 50%; margin: 16px 0;" />`
            : ''
        }
        <p style="margin-top: 24px;">
          <a href="${data.ctaUrl}" style="background-color: #0A362B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            상담 신청 완료하기
          </a>
        </p>
      `,
    },
    profile_view: {
      subject: `${data.proName || '관심 프로'}가 인기 급상승 중이에요!`,
      content: `
        <p>${userName}님이 관심을 보인 ${data.proName || '프로'}의 문의가 증가하고 있어요.</p>
        <p>지금 상담을 신청하면 빠른 응답을 받을 수 있어요!</p>
        <p style="margin-top: 24px;">
          <a href="${data.ctaUrl}" style="background-color: #0A362B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            ${data.proName || '프로'} 프로필 보기
          </a>
        </p>
      `,
    },
    signup_abandon: {
      subject: '가입이 거의 완료되었어요!',
      content: `
        <p>${userName}님, TEE:UP 가입이 90% 완료되었어요.</p>
        <p>지금 마무리하고 최고의 골프 프로를 만나보세요!</p>
        <p style="margin-top: 24px;">
          <a href="${data.ctaUrl}" style="background-color: #0A362B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            가입 완료하기
          </a>
        </p>
      `,
    },
  };

  const template = templates[templateId] || templates.quiz_abandon;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="${baseUrl}/images/logo.png" alt="TEE:UP" style="height: 32px;" />
      </div>

      <div style="background-color: #F7F4F0; border-radius: 12px; padding: 32px;">
        ${template.content}
      </div>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E8E8E5; text-align: center; font-size: 12px; color: #8A8A87;">
        <p>이 이메일은 TEE:UP에서 발송되었습니다.</p>
        <p>
          <a href="${data.unsubscribeUrl}" style="color: #8A8A87;">수신 거부</a>
        </p>
        <p>© ${new Date().getFullYear()} TEE:UP. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const text = `
${userName}님,

${template.content.replace(/<[^>]*>/g, '')}

링크: ${data.ctaUrl}

---
이 이메일은 TEE:UP에서 발송되었습니다.
수신 거부: ${data.unsubscribeUrl}
  `.trim();

  return {
    subject: template.subject,
    html,
    text,
  };
}
