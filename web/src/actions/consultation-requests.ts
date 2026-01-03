'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';

export type ConsultationRequestStatus = 'new' | 'contacted' | 'converted' | 'closed';

export type ConsultationRequest = {
  id: string;
  pro_id: string;
  requester_name: string;
  requester_phone: string;
  message: string | null;
  source_url: string | null;
  referrer: string | null;
  status: ConsultationRequestStatus;
  created_at: string;
  updated_at: string;
};

export interface CreateConsultationRequestInput {
  proId: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  sourceUrl?: string;
  referrer?: string;
}

export async function createConsultationRequest(
  input: CreateConsultationRequestInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    // Validate: either phone or email must be provided
    const hasPhone = input.phone && input.phone.trim().length > 0;
    const hasEmail = input.email && input.email.trim().length > 0;

    if (!hasPhone && !hasEmail) {
      return { success: false, error: '연락처(전화번호 또는 이메일)를 입력해주세요.' };
    }

    // Validate phone if provided
    if (hasPhone) {
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phoneRegex.test(input.phone.replace(/-/g, ''))) {
        return { success: false, error: '올바른 휴대폰 번호를 입력해주세요.' };
      }
    }

    // Validate email if provided
    if (hasEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email!)) {
        return { success: false, error: '올바른 이메일 주소를 입력해주세요.' };
      }
    }

    const { data: pro, error: proError } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('id', input.proId)
      .single();

    if (proError || !pro) {
      return { success: false, error: '프로를 찾을 수 없습니다.' };
    }

    // Build message with email if provided (since DB doesn't have email column yet)
    let fullMessage = input.message || '';
    if (hasEmail) {
      fullMessage = `[이메일: ${input.email}]\n${fullMessage}`.trim();
    }

    const { data, error } = await supabase
      .from('consultation_requests')
      .insert({
        pro_id: input.proId,
        requester_name: input.name,
        requester_phone: hasPhone ? input.phone.replace(/-/g, '') : 'email-contact',
        message: fullMessage || null,
        source_url: input.sourceUrl || null,
        referrer: input.referrer || null,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('createConsultationRequest error:', error);
      return { success: false, error: '요청 생성에 실패했습니다.' };
    }

    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error('createConsultationRequest error:', err);
    return { success: false, error: '요청 처리 중 오류가 발생했습니다.' };
  }
}
