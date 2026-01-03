/**
 * Retargeting Cron Job
 * TEE:UP Portfolio SaaS
 *
 * Processes pending retargeting events and sends notifications.
 * Should be called periodically (e.g., every 15 minutes).
 *
 * Protected by CRON_SECRET to prevent unauthorized access.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, generateRetargetingEmail } from '@/lib/email';
import {
  getPendingRetargets,
  markEventRetargeted,
  logRetargetingNotification,
} from '@/actions/retargeting';

// ============================================================
// Configuration
// ============================================================

const BATCH_SIZE = 50;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://teeup.golf';

// ============================================================
// Route Handler
// ============================================================

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processRetargetingBatch();
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Retargeting Cron] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also support POST for Vercel cron
export async function POST(request: NextRequest) {
  return GET(request);
}

// ============================================================
// Processing Logic
// ============================================================

async function processRetargetingBatch() {
  const startTime = Date.now();
  const stats = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
  };

  // Get pending retargets
  const pendingResult = await getPendingRetargets(BATCH_SIZE);

  if (!pendingResult.success) {
    return {
      success: false,
      error: pendingResult.error,
      stats,
      duration: Date.now() - startTime,
    };
  }

  if (!pendingResult.data) {
    return {
      success: false,
      error: 'No data returned',
      stats,
      duration: Date.now() - startTime,
    };
  }

  const pendingEvents = pendingResult.data;
  stats.processed = pendingEvents.length;

  if (pendingEvents.length === 0) {
    return {
      success: true,
      message: 'No pending retargets',
      stats,
      duration: Date.now() - startTime,
    };
  }

  // Get pro info for personalization
  const supabase = await createClient();
  const proIds = [...new Set(pendingEvents.filter((e) => e.pro_id).map((e) => e.pro_id))];

  const { data: pros } = await supabase
    .from('pro_profiles')
    .select('id, title, slug, profile_image_url')
    .in('id', proIds);

  const proMap = new Map(pros?.map((p) => [p.id, p]) || []);

  // Process each event
  for (const event of pendingEvents) {
    try {
      // Skip if no email
      if (!event.email) {
        stats.skipped++;
        continue;
      }

      // Get pro info if available
      const pro = event.pro_id ? proMap.get(event.pro_id) ?? null : null;

      // Generate CTA URL based on event type
      const ctaUrl = generateCtaUrl(event, pro);
      const unsubscribeUrl = `${APP_URL}/unsubscribe?email=${encodeURIComponent(event.email)}`;

      // Generate email content
      const emailContent = generateRetargetingEmail(event.event_type, {
        userName: (event.metadata as Record<string, unknown>)?.user_name as string,
        proName: pro?.title,
        proSlug: pro?.slug,
        proImage: pro?.profile_image_url,
        ctaUrl,
        unsubscribeUrl,
      });

      // Send email
      const emailResult = await sendEmail({
        to: event.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        tags: ['retargeting', event.event_type],
      });

      // Log the notification
      await logRetargetingNotification({
        campaignId: event.campaign_id,
        activityEventId: event.event_id,
        userId: event.user_id || undefined,
        recipientEmail: event.email,
        status: emailResult.success ? 'sent' : 'failed',
        errorMessage: emailResult.error,
      });

      // Mark event as retargeted
      if (emailResult.success) {
        await markEventRetargeted(event.event_id);
        stats.sent++;
      } else {
        stats.failed++;
      }
    } catch (error) {
      console.error('[Retargeting] Error processing event:', event.event_id, error);
      stats.failed++;
    }
  }

  return {
    success: true,
    stats,
    duration: Date.now() - startTime,
  };
}

// ============================================================
// Helpers
// ============================================================

function generateCtaUrl(
  event: { event_type: string; metadata: Record<string, unknown> },
  pro: { slug: string } | null
): string {
  switch (event.event_type) {
    case 'quiz_abandon':
      return `${APP_URL}/quiz?resume=true`;

    case 'form_abandon':
    case 'profile_view':
    case 'consultation_abandon':
      return pro ? `${APP_URL}/${pro.slug}` : `${APP_URL}/explore`;

    case 'signup_abandon':
      return `${APP_URL}/auth/signup`;

    default:
      return APP_URL;
  }
}
