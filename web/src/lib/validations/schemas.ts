/**
 * Zod Validation Schemas
 *
 * Server Action 입력 검증을 위한 스키마 정의
 *
 * @example
 * ```ts
 * import { quickProfileSchema, validateInput } from '@/lib/validations';
 *
 * const result = validateInput(quickProfileSchema, input);
 * if (!result.success) {
 *   return { success: false, error: result.error };
 * }
 * const validData = result.data;
 * ```
 */
import { z } from 'zod';
// Type imports reserved for future use
// import type { ThemeType, ContactMethod } from '@/actions/types';

// ============================================
// Common Schemas
// ============================================

/**
 * UUID 형식 검증
 */
export const uuidSchema = z.string().uuid('유효한 ID 형식이 아닙니다');

/**
 * Slug 형식 검증 (URL-safe string)
 */
export const slugSchema = z
  .string()
  .min(2, '슬러그는 최소 2자 이상이어야 합니다')
  .max(50, '슬러그는 최대 50자까지 가능합니다')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    '슬러그는 소문자, 숫자, 하이픈만 사용할 수 있습니다'
  );

/**
 * 한글/영문 이름 검증
 */
export const nameSchema = z
  .string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(50, '이름은 최대 50자까지 가능합니다')
  .regex(
    /^[가-힣a-zA-Z\s]+$/,
    '이름은 한글, 영문, 공백만 사용할 수 있습니다'
  );

/**
 * 전화번호 검증 (한국 형식)
 */
export const phoneSchema = z
  .string()
  .regex(
    /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
    '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'
  );

/**
 * 이메일 검증
 */
export const emailSchema = z
  .string()
  .email('올바른 이메일 형식이 아닙니다');

/**
 * URL 검증
 */
export const urlSchema = z
  .string()
  .url('올바른 URL 형식이 아닙니다');

/**
 * 카카오톡 오픈채팅 URL 검증
 */
export const kakaoOpenChatUrlSchema = z
  .string()
  .regex(
    /^https:\/\/open\.kakao\.com\/.+$/,
    '올바른 카카오톡 오픈채팅 URL이 아닙니다'
  );

// ============================================
// Profile Schemas
// ============================================

/**
 * 테마 타입 enum
 */
export const themeTypeSchema = z.enum(['visual', 'curriculum', 'social'] as const);

/**
 * 연락 방식 enum
 */
export const contactMethodSchema = z.enum(['kakao', 'phone', 'email', 'form'] as const);

/**
 * 구독 티어 enum
 */
export const subscriptionTierSchema = z.enum(['free', 'basic', 'pro'] as const);

/**
 * 빠른 프로필 생성 입력 검증 (QuickProfileInput)
 */
export const quickProfileInputSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 가능합니다'),
  bio: z
    .string()
    .max(500, '소개글은 최대 500자까지 가능합니다')
    .optional(),
  specialty: z
    .string()
    .min(2, '전문 분야를 입력해주세요')
    .max(100, '전문 분야는 최대 100자까지 가능합니다'),
  location: z
    .string()
    .max(100, '위치는 최대 100자까지 가능합니다')
    .optional(),
  priceRange: z
    .string()
    .max(50, '가격대는 최대 50자까지 가능합니다')
    .optional(),
  contactType: z.enum(['kakao', 'phone'] as const, '연락 방식을 선택해주세요'),
  contactValue: z
    .string()
    .min(1, '연락처를 입력해주세요')
    .max(200, '연락처는 최대 200자까지 가능합니다'),
  profileImageUrl: urlSchema.optional(),
});

/**
 * 프로필 업데이트 입력 검증 (ProProfileUpdate)
 */
export const proProfileUpdateSchema = z.object({
  slug: slugSchema.optional(),
  title: z
    .string()
    .min(2, '제목은 최소 2자 이상이어야 합니다')
    .max(100, '제목은 최대 100자까지 가능합니다')
    .optional(),
  bio: z
    .string()
    .max(1000, '소개글은 최대 1000자까지 가능합니다')
    .nullable()
    .optional(),
  specialties: z
    .array(z.string().max(50))
    .max(10, '전문 분야는 최대 10개까지 등록할 수 있습니다')
    .optional(),
  location: z
    .string()
    .max(100, '위치는 최대 100자까지 가능합니다')
    .nullable()
    .optional(),
  tour_experience: z
    .string()
    .max(500, '투어 경력은 최대 500자까지 가능합니다')
    .nullable()
    .optional(),
  certifications: z
    .array(z.string().max(100))
    .max(20, '자격증은 최대 20개까지 등록할 수 있습니다')
    .optional(),
  theme_type: themeTypeSchema.optional(),
  theme_config: z.record(z.string(), z.unknown()).nullable().optional(),
  payment_link: urlSchema.nullable().optional(),
  open_chat_url: kakaoOpenChatUrlSchema.nullable().optional(),
  booking_url: urlSchema.nullable().optional(),
  hero_image_url: urlSchema.nullable().optional(),
  profile_image_url: urlSchema.nullable().optional(),
  gallery_images: z
    .array(urlSchema)
    .max(20, '갤러리 이미지는 최대 20개까지 등록할 수 있습니다')
    .optional(),
  video_url: urlSchema.nullable().optional(),
  instagram_username: z
    .string()
    .max(30, '인스타그램 사용자명은 최대 30자까지 가능합니다')
    .regex(/^[a-zA-Z0-9._]*$/, '올바른 인스타그램 사용자명이 아닙니다')
    .nullable()
    .optional(),
  youtube_channel_id: z
    .string()
    .max(50, '유튜브 채널 ID는 최대 50자까지 가능합니다')
    .nullable()
    .optional(),
  kakao_talk_id: z
    .string()
    .max(50, '카카오톡 ID는 최대 50자까지 가능합니다')
    .nullable()
    .optional(),
  subscription_tier: subscriptionTierSchema.optional(),
  studio_id: uuidSchema.nullable().optional(),
});

/**
 * 프로필 생성 입력 검증 (ProProfileInsert without user_id)
 */
export const proProfileCreateSchema = z.object({
  slug: slugSchema.optional(),
  title: z
    .string()
    .min(2, '제목은 최소 2자 이상이어야 합니다')
    .max(100, '제목은 최대 100자까지 가능합니다'),
  bio: z.string().max(1000).nullable().optional(),
  specialties: z.array(z.string().max(50)).max(10).default([]),
  location: z.string().max(100).nullable().optional(),
  tour_experience: z.string().max(500).nullable().optional(),
  certifications: z.array(z.string().max(100)).max(20).default([]),
  theme_type: themeTypeSchema.default('curriculum'),
  theme_config: z.record(z.string(), z.unknown()).nullable().optional(),
  payment_link: urlSchema.nullable().optional(),
  open_chat_url: kakaoOpenChatUrlSchema.nullable().optional(),
  booking_url: urlSchema.nullable().optional(),
  hero_image_url: urlSchema.nullable().optional(),
  profile_image_url: urlSchema.nullable().optional(),
  gallery_images: z.array(urlSchema).max(20).default([]),
  video_url: urlSchema.nullable().optional(),
  instagram_username: z.string().max(30).nullable().optional(),
  youtube_channel_id: z.string().max(50).nullable().optional(),
  kakao_talk_id: z.string().max(50).nullable().optional(),
  subscription_tier: subscriptionTierSchema.default('free'),
  studio_id: uuidSchema.nullable().optional(),
});

// ============================================
// Lead Schemas
// ============================================

/**
 * 리드 추적 입력 검증
 */
export const trackLeadInputSchema = z.object({
  contact_name: z
    .string()
    .max(50, '이름은 최대 50자까지 가능합니다')
    .optional(),
  contact_method: contactMethodSchema,
  source_url: urlSchema.optional(),
  referrer: z
    .string()
    .max(200, '리퍼러는 최대 200자까지 가능합니다')
    .optional(),
});

/**
 * 리드 업데이트 입력 검증
 */
export const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'lost'] as const).optional(),
  notes: z
    .string()
    .max(1000, '메모는 최대 1000자까지 가능합니다')
    .optional(),
  contact_name: z.string().max(50).optional(),
});

// ============================================
// Studio Schemas
// ============================================

/**
 * 스튜디오 생성 입력 검증
 */
export const studioCreateSchema = z.object({
  name: z
    .string()
    .min(2, '스튜디오 이름은 최소 2자 이상이어야 합니다')
    .max(100, '스튜디오 이름은 최대 100자까지 가능합니다'),
  slug: slugSchema,
  description: z
    .string()
    .max(1000, '설명은 최대 1000자까지 가능합니다')
    .optional(),
  location: z.string().max(200).optional(),
  contact_phone: phoneSchema.optional(),
  contact_email: emailSchema.optional(),
  website_url: urlSchema.optional(),
  logo_url: urlSchema.optional(),
  cover_image_url: urlSchema.optional(),
});

/**
 * 스튜디오 업데이트 입력 검증
 */
export const studioUpdateSchema = studioCreateSchema.partial();

// ============================================
// Scheduler Schemas
// ============================================

/**
 * 예약 가능 시간 슬롯 검증
 */
export const timeSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식은 YYYY-MM-DD여야 합니다'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, '시간 형식은 HH:MM이어야 합니다'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, '시간 형식은 HH:MM이어야 합니다'),
});

/**
 * 예약 생성 입력 검증
 */
export const bookingCreateSchema = z.object({
  pro_profile_id: uuidSchema,
  slot_id: uuidSchema,
  customer_name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 최대 50자까지 가능합니다'),
  customer_phone: phoneSchema,
  customer_email: emailSchema.optional(),
  notes: z.string().max(500).optional(),
  lesson_type: z.string().max(50).optional(),
});

// ============================================
// Type Exports (inferred from schemas)
// ============================================

export type QuickProfileInputValidated = z.infer<typeof quickProfileInputSchema>;
export type ProProfileUpdateValidated = z.infer<typeof proProfileUpdateSchema>;
export type ProProfileCreateValidated = z.infer<typeof proProfileCreateSchema>;
export type TrackLeadInputValidated = z.infer<typeof trackLeadInputSchema>;
export type LeadUpdateValidated = z.infer<typeof leadUpdateSchema>;
export type StudioCreateValidated = z.infer<typeof studioCreateSchema>;
export type StudioUpdateValidated = z.infer<typeof studioUpdateSchema>;
export type TimeSlotValidated = z.infer<typeof timeSlotSchema>;
export type BookingCreateValidated = z.infer<typeof bookingCreateSchema>;
