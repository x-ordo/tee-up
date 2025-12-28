/**
 * Test utilities for Server Actions
 *
 * Provides mock factories and helpers for testing Server Actions
 * that use Supabase and authentication.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mock user for authenticated tests
 */
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
};

/**
 * Mock pro profile data
 */
export const mockProProfile = {
  id: 'profile-123',
  user_id: 'user-123',
  slug: 'test-pro',
  title: 'Test Pro',
  bio: 'Test bio',
  specialties: ['putting', 'short-game'],
  location: 'Seoul',
  tour_experience: null,
  certifications: ['PGA'],
  theme_type: 'curriculum' as const,
  theme_config: null,
  payment_link: null,
  open_chat_url: 'https://open.kakao.com/test',
  booking_url: null,
  hero_image_url: null,
  profile_image_url: null,
  gallery_images: [],
  video_url: null,
  instagram_username: null,
  youtube_channel_id: null,
  kakao_talk_id: null,
  profile_views: 100,
  monthly_lead_count: 5,
  total_leads: 50,
  matched_lessons: 10,
  rating: 4.5,
  subscription_tier: 'free' as const,
  is_approved: true,
  is_featured: false,
  studio_id: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Mock lead data
 */
export const mockLead = {
  id: 'lead-123',
  pro_id: 'profile-123',
  contact_name: 'Test Customer',
  contact_method: 'kakao' as const,
  source_url: 'https://example.com/profile',
  referrer: 'google',
  is_billable: true,
  billed_at: null,
  created_at: '2024-01-01T00:00:00Z',
};

/**
 * Creates a chainable mock Supabase client
 */
export function createMockSupabaseClient() {
  const mockClient = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  };

  // Create chainable query builder mock
  const queryBuilder: Record<string, jest.Mock> = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    eq: jest.fn(),
    neq: jest.fn(),
    order: jest.fn(),
    limit: jest.fn(),
    range: jest.fn(),
    single: jest.fn(),
  };

  // Make all query methods chainable by default
  Object.keys(queryBuilder).forEach(key => {
    if (key !== 'single') {
      queryBuilder[key].mockReturnValue(queryBuilder);
    }
  });

  mockClient.from.mockReturnValue(queryBuilder);

  return { mockClient, queryBuilder };
}

/**
 * Mock authenticated user response
 */
export function mockAuthenticatedUser(mockClient: ReturnType<typeof createMockSupabaseClient>['mockClient']) {
  mockClient.auth.getUser.mockResolvedValue({
    data: { user: mockUser },
    error: null,
  });
}

/**
 * Mock unauthenticated user response
 */
export function mockUnauthenticatedUser(mockClient: ReturnType<typeof createMockSupabaseClient>['mockClient']) {
  mockClient.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: { message: 'Not authenticated' },
  });
}

/**
 * Mock successful query response
 */
export function mockQuerySuccess<T>(
  queryBuilder: ReturnType<typeof createMockSupabaseClient>['queryBuilder'],
  data: T,
  useSingle = true
) {
  if (useSingle) {
    queryBuilder.single.mockResolvedValue({ data, error: null });
  } else {
    // For queries that don't use .single()
    queryBuilder.order.mockResolvedValue({ data, error: null });
    queryBuilder.range.mockResolvedValue({ data, error: null });
    queryBuilder.select.mockResolvedValue({ data, error: null });
  }
}

/**
 * Mock query error response
 */
export function mockQueryError(
  queryBuilder: ReturnType<typeof createMockSupabaseClient>['queryBuilder'],
  errorMessage: string,
  errorCode = 'ERROR'
) {
  const error = { message: errorMessage, code: errorCode };
  queryBuilder.single.mockResolvedValue({ data: null, error });
  queryBuilder.order.mockResolvedValue({ data: null, error });
  queryBuilder.range.mockResolvedValue({ data: null, error });
  queryBuilder.select.mockResolvedValue({ data: null, error });
}

/**
 * Mock not found error (PGRST116)
 */
export function mockNotFound(
  queryBuilder: ReturnType<typeof createMockSupabaseClient>['queryBuilder']
) {
  mockQueryError(queryBuilder, 'No rows found', 'PGRST116');
}

/**
 * Valid quick profile input for testing
 */
export const validQuickProfileInput = {
  name: '김프로',
  bio: '골프 전문가입니다',
  specialty: '퍼팅',
  location: '서울',
  priceRange: '10만원~',
  contactType: 'kakao' as const,
  contactValue: 'https://open.kakao.com/test',
  profileImageUrl: undefined,
};

/**
 * Valid lead input for testing
 */
export const validLeadInput = {
  contact_name: 'Test Customer',
  contact_method: 'kakao' as const,
  source_url: 'https://example.com',
  referrer: 'google',
};

/**
 * Invalid inputs for validation testing
 */
export const invalidInputs = {
  emptyName: { ...validQuickProfileInput, name: '' },
  shortName: { ...validQuickProfileInput, name: 'A' },
  invalidContactType: { ...validQuickProfileInput, contactType: 'invalid' },
  emptyContactValue: { ...validQuickProfileInput, contactValue: '' },
};
