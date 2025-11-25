/**
 * 리드 추적 라이브러리
 * @description 프로를 위한 리드(문의) 추적 및 관리 기능
 */

import { createClient } from '@/lib/supabase/client';
import type { ILead, ILeadStats, IChatRoom } from '@/types';

// ============================================
// Constants
// ============================================

export const SUBSCRIPTION_LIMITS = {
  basic: 3,
  pro: -1, // 무제한
} as const;

// ============================================
// Lead Functions
// ============================================

/**
 * 프로의 리드 목록 조회
 */
export async function getLeads(proId: string): Promise<ILead[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      id,
      pro_id,
      golfer_id,
      status,
      created_at,
      matched_at,
      golfer:golfer_id (
        id,
        full_name,
        avatar_url,
        phone
      )
    `)
    .eq('pro_id', proId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return data.map((room) => {
    // Supabase joins can return array or object depending on relationship
    const golferData = Array.isArray(room.golfer) ? room.golfer[0] : room.golfer;

    return {
      id: room.id,
      pro_id: room.pro_id,
      golfer_id: room.golfer_id,
      chat_room_id: room.id,
      status: mapRoomStatusToLeadStatus(room.status),
      created_at: room.created_at,
      matched_at: room.matched_at,
      golfer: golferData as ILead['golfer'],
    };
  });
}

/**
 * 프로의 리드 통계 조회
 */
export async function getLeadStats(proId: string): Promise<ILeadStats> {
  const supabase = createClient();

  // 프로 프로필 정보
  const { data: profile } = await supabase
    .from('pro_profiles')
    .select('monthly_chat_count, total_leads, matched_lessons, subscription_tier')
    .eq('user_id', proId)
    .single();

  // 채팅방 상태별 카운트
  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('status')
    .eq('pro_id', proId);

  const statusCounts = {
    active: 0,
    matched: 0,
    closed: 0,
  };

  rooms?.forEach((room) => {
    if (room.status in statusCounts) {
      statusCounts[room.status as keyof typeof statusCounts]++;
    }
  });

  const leadLimit =
    profile?.subscription_tier === 'pro'
      ? -1
      : SUBSCRIPTION_LIMITS.basic;

  const leadsRemaining =
    leadLimit === -1 ? -1 : Math.max(0, leadLimit - (profile?.monthly_chat_count || 0));

  return {
    total_leads: profile?.total_leads || 0,
    new_leads: statusCounts.active,
    contacted: statusCounts.active + statusCounts.matched,
    matched: profile?.matched_lessons || 0,
    conversion_rate:
      profile?.total_leads > 0
        ? Math.round((profile?.matched_lessons / profile?.total_leads) * 100)
        : 0,
    leads_remaining: leadsRemaining,
    lead_limit: leadLimit,
  };
}

/**
 * 이번 달 리드 수 조회
 */
export async function getMonthlyLeadCount(proId: string): Promise<number> {
  const supabase = createClient();

  const { data } = await supabase
    .from('pro_profiles')
    .select('monthly_chat_count')
    .eq('user_id', proId)
    .single();

  return data?.monthly_chat_count || 0;
}

/**
 * 리드 제한 확인
 */
export async function checkLeadLimit(
  proId: string
): Promise<{ canAccept: boolean; remaining: number; limit: number }> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('pro_profiles')
    .select('monthly_chat_count, subscription_tier')
    .eq('user_id', proId)
    .single();

  if (!profile) {
    return { canAccept: false, remaining: 0, limit: 0 };
  }

  if (profile.subscription_tier === 'pro') {
    return { canAccept: true, remaining: -1, limit: -1 };
  }

  const limit = SUBSCRIPTION_LIMITS.basic;
  const remaining = Math.max(0, limit - profile.monthly_chat_count);

  return {
    canAccept: remaining > 0,
    remaining,
    limit,
  };
}

/**
 * 리드 상태 업데이트 (매칭 완료 시 카운트 증가)
 */
export async function markLeadAsMatched(
  roomId: string,
  proId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // 트랜잭션으로 처리
  const { error: roomError } = await supabase
    .from('chat_rooms')
    .update({
      status: 'matched',
      matched_at: new Date().toISOString(),
    })
    .eq('id', roomId);

  if (roomError) {
    return { success: false, error: roomError.message };
  }

  // 매칭 레슨 수 증가
  const { error: profileError } = await supabase
    .from('pro_profiles')
    .update({
      matched_lessons: supabase.rpc('increment_matched_lessons'),
    })
    .eq('user_id', proId);

  if (profileError) {
    console.error('Error incrementing matched lessons:', profileError);
  }

  return { success: true };
}

// ============================================
// Analytics Functions
// ============================================

/**
 * 기간별 리드 추이 조회
 */
export async function getLeadTrend(
  proId: string,
  days: number = 30
): Promise<{ date: string; count: number }[]> {
  const supabase = createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from('chat_rooms')
    .select('created_at')
    .eq('pro_id', proId)
    .gte('created_at', startDate.toISOString());

  if (!data) return [];

  // 날짜별 그룹화
  const countByDate: Record<string, number> = {};

  data.forEach((room) => {
    const date = new Date(room.created_at).toISOString().split('T')[0];
    countByDate[date] = (countByDate[date] || 0) + 1;
  });

  // 모든 날짜 채우기
  const result: { date: string; count: number }[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date()) {
    const dateStr = currentDate.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: countByDate[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

/**
 * 전환 퍼널 데이터 조회
 */
export async function getConversionFunnel(proId: string): Promise<{
  views: number;
  leads: number;
  responded: number;
  matched: number;
}> {
  const supabase = createClient();

  // 프로필 조회수
  const { data: profile } = await supabase
    .from('pro_profiles')
    .select('profile_views, total_leads, matched_lessons')
    .eq('user_id', proId)
    .single();

  // 응답한 채팅방 수 (메시지가 있는)
  const { count: respondedCount } = await supabase
    .from('chat_rooms')
    .select('id', { count: 'exact' })
    .eq('pro_id', proId)
    .in('status', ['active', 'matched']);

  return {
    views: profile?.profile_views || 0,
    leads: profile?.total_leads || 0,
    responded: respondedCount || 0,
    matched: profile?.matched_lessons || 0,
  };
}

// ============================================
// Helper Functions
// ============================================

function mapRoomStatusToLeadStatus(
  status: IChatRoom['status']
): ILead['status'] {
  switch (status) {
    case 'active':
      return 'new';
    case 'matched':
      return 'matched';
    case 'closed':
      return 'lost';
    default:
      return 'new';
  }
}
