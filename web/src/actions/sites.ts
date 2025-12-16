'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import type { ActionResult } from './types';

/**
 * Site type from database (sites table)
 */
export type Site = {
  id: string;
  owner_id: string;
  site_type: 'pro' | 'studio';
  handle: string;
  title: string;
  tagline: string | null;
  status: 'draft' | 'published' | 'suspended';
  // Contact fields (마스킹됨)
  phone: string | null;
  email: string | null;
  kakao_url: string | null;
  booking_url: string | null;
  // Media
  hero_image_url: string | null;
  profile_image_url: string | null;
  gallery_images: string[];
  video_url: string | null;
  // Social
  instagram_username: string | null;
  youtube_channel_id: string | null;
  // Subscription
  subscription_tier: 'free' | 'basic' | 'pro';
  subscription_expires_at: string | null;
  // Metrics
  total_views: number;
  total_leads: number;
  monthly_lead_count: number;
  // Timestamps
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Site theme from database
 */
export type SiteTheme = {
  id: string;
  site_id: string;
  preset_id: string | null;
  preset_slug: string | null;
  variant: string;
  accent_color: string | null;
  computed_tokens: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

/**
 * Public site data (연락처 마스킹됨)
 */
export type PublicSite = Omit<Site, 'phone' | 'email'> & {
  phone: null;  // 클라이언트에 절대 전송 안 함
  email: null;
  has_phone: boolean;
  has_email: boolean;
  has_kakao: boolean;
  has_booking: boolean;
};

/**
 * Get published site by handle (공개 조회, 연락처 마스킹)
 */
export async function getPublicSiteByHandle(
  handle: string
): Promise<ActionResult<{ site: PublicSite; theme: SiteTheme | null } | null>> {
  try {
    const supabase = await createClient();

    // 사이트 조회 (published만)
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('handle', handle)
      .eq('status', 'published')
      .single();

    if (siteError) {
      if (siteError.code === 'PGRST116') {
        return { success: true, data: null };
      }
      return { success: false, error: siteError.message };
    }

    // 테마 조회
    const { data: theme } = await supabase
      .from('site_theme')
      .select('*')
      .eq('site_id', site.id)
      .single();

    // 연락처 마스킹 - 클라이언트에 절대 전송 금지
    const publicSite: PublicSite = {
      ...site,
      phone: null,
      email: null,
      has_phone: !!site.phone,
      has_email: !!site.email,
      has_kakao: !!site.kakao_url,
      has_booking: !!site.booking_url,
    };

    return {
      success: true,
      data: {
        site: publicSite,
        theme: theme || null,
      },
    };
  } catch (err) {
    console.error('getPublicSiteByHandle error:', err);
    return { success: false, error: 'Failed to fetch site' };
  }
}

/**
 * Log site event via RPC (과금 이벤트 포함)
 */
export async function logSiteEvent(
  siteId: string,
  eventType: 'page_view' | 'contact_reveal' | 'contact_form' | 'kakao_click' | 'phone_click' | 'booking_click' | 'cta_click',
  metadata?: Record<string, unknown>
): Promise<ActionResult<{ event_id: string; is_billable: boolean }>> {
  try {
    const supabase = await createClient();
    const headersList = await headers();

    // 익명 식별자 생성 (쿠키 기반은 클라이언트에서)
    const userAgent = headersList.get('user-agent') || undefined;
    const xForwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = xForwardedFor?.split(',')[0] || realIp || 'unknown';

    // IP 해시 (단방향)
    const ipHash = await hashString(ip);

    const { data, error } = await supabase.rpc('tup_log_site_event', {
      p_site_id: siteId,
      p_event_type: eventType,
      p_visitor_id: null, // 클라이언트에서 쿠키로 전달
      p_ip_hash: ipHash,
      p_user_agent: userAgent,
      p_referrer: headersList.get('referer') || null,
      p_metadata: metadata || {},
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || 'Unknown error' };
    }

    return {
      success: true,
      data: {
        event_id: data.event_id,
        is_billable: data.is_billable,
      },
    };
  } catch (err) {
    console.error('logSiteEvent error:', err);
    return { success: false, error: 'Failed to log event' };
  }
}

/**
 * Get contact info (연락처 보기 - contact_reveal 이벤트 로깅)
 * 이 함수는 실제 연락처를 반환하며, 호출 시 과금 이벤트가 기록됨
 */
export async function revealContactInfo(
  siteId: string
): Promise<ActionResult<{
  phone: string | null;
  email: string | null;
  kakao_url: string | null;
  booking_url: string | null;
}>> {
  try {
    const supabase = await createClient();

    // 1. 사이트 조회 (published만)
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('phone, email, kakao_url, booking_url, status')
      .eq('id', siteId)
      .eq('status', 'published')
      .single();

    if (siteError || !site) {
      return { success: false, error: 'Site not found or not published' };
    }

    // 2. contact_reveal 이벤트 로깅 (과금)
    const eventResult = await logSiteEvent(siteId, 'contact_reveal', {
      revealed_fields: {
        phone: !!site.phone,
        email: !!site.email,
        kakao: !!site.kakao_url,
      },
    });

    if (!eventResult.success) {
      // Rate limited 등의 경우
      return { success: false, error: eventResult.error || 'Failed to log event' };
    }

    // 3. 연락처 반환
    return {
      success: true,
      data: {
        phone: site.phone,
        email: site.email,
        kakao_url: site.kakao_url,
        booking_url: site.booking_url,
      },
    };
  } catch (err) {
    console.error('revealContactInfo error:', err);
    return { success: false, error: 'Failed to reveal contact info' };
  }
}

/**
 * Reveal contact by handle (convenience wrapper)
 */
export async function revealContactByHandle(
  handle: string
): Promise<ActionResult<{
  phone: string | null;
  email: string | null;
  kakao_url: string | null;
  booking_url: string | null;
}>> {
  // 1. handle로 siteId 조회
  const siteResult = await getPublicSiteByHandle(handle);
  if (!siteResult.success || !siteResult.data) {
    return { success: false, error: '사이트를 찾을 수 없습니다.' };
  }

  // 2. 연락처 조회 (이벤트 로깅 포함)
  return revealContactInfo(siteResult.data.site.id);
}

/**
 * Simple hash function for IP anonymization
 */
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str + process.env.IP_HASH_SALT || 'teeup-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
