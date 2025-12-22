/**
 * Booking Reminders Cron Job
 * Vercel Cron: Runs every hour to send 24-hour reminder notifications
 *
 * vercel.json 설정:
 * {
 *   "crons": [{
 *     "path": "/api/cron/booking-reminders",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendBookingReminderAlimtalk,
  formatDateForAlimtalk,
  formatTimeForAlimtalk,
  isValidPhoneNumber,
} from '@/lib/kakao';

// ============================================
// Types
// ============================================

interface BookingWithDetails {
  id: string;
  start_at: string;
  end_at: string;
  guest_name: string | null;
  guest_phone: string | null;
  customer_id: string | null;
  pro_profiles: {
    id: string;
    display_name: string;
    studios: {
      name: string;
      address: string | null;
    } | null;
  };
  profiles: {
    phone: string | null;
    full_name: string | null;
  } | null;
}

// ============================================
// Cron Handler
// ============================================

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel Cron sets this header)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use service role for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceRole) {
      console.error('[Cron] Missing Supabase credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Calculate time window (22-26 hours from now for 24h reminder)
    const now = new Date();
    const from = new Date(now.getTime() + 22 * 60 * 60 * 1000);
    const to = new Date(now.getTime() + 26 * 60 * 60 * 1000);

    // Fetch upcoming bookings in the window
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        start_at,
        end_at,
        guest_name,
        guest_phone,
        customer_id,
        reminder_sent_at,
        pro_profiles!bookings_pro_id_fkey (
          id,
          display_name,
          studios (
            name,
            address
          )
        ),
        profiles!bookings_customer_id_fkey (
          phone,
          full_name
        )
      `)
      .eq('status', 'confirmed')
      .gte('start_at', from.toISOString())
      .lte('start_at', to.toISOString())
      .is('reminder_sent_at', null);

    if (error) {
      console.error('[Cron] Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No bookings need reminders',
        processed: 0,
      });
    }

    // Send reminders
    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const booking of bookings) {
      results.processed++;

      // Get recipient info
      const typedBooking = booking as unknown as BookingWithDetails;
      const phone =
        typedBooking.guest_phone ||
        typedBooking.profiles?.phone;
      const guestName =
        typedBooking.guest_name ||
        typedBooking.profiles?.full_name ||
        '고객';
      const proName = typedBooking.pro_profiles?.display_name || '프로';
      const location =
        typedBooking.pro_profiles?.studios?.name ||
        typedBooking.pro_profiles?.studios?.address ||
        '레슨 장소';

      // Skip if no valid phone
      if (!phone || !isValidPhoneNumber(phone)) {
        results.skipped++;
        continue;
      }

      // Format date/time
      const startDate = new Date(typedBooking.start_at);
      const lessonDate = formatDateForAlimtalk(startDate);
      const lessonTime = formatTimeForAlimtalk(startDate);

      // Send reminder
      const result = await sendBookingReminderAlimtalk({
        to: phone,
        guestName,
        proName,
        lessonDate,
        lessonTime,
        location,
      });

      if (result.success) {
        results.sent++;

        // Mark reminder as sent
        await supabase
          .from('bookings')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', typedBooking.id);
      } else {
        results.failed++;
        results.errors.push(`Booking ${typedBooking.id}: ${result.error}`);
      }
    }

    console.log('[Cron] Booking reminders completed:', results);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('[Cron] Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// Configuration
// ============================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds max
