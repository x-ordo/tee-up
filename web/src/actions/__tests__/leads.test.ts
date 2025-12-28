/**
 * Unit tests for leads Server Actions
 *
 * Tests cover:
 * - trackLead
 * - getLeadStats
 * - getMyLeads
 * - checkLeadLimit
 */

import { createClient } from '@/lib/supabase/server';
import {
  trackLead,
  getLeadStats,
  getMyLeads,
  checkLeadLimit,
} from '../leads';
import {
  createMockSupabaseClient,
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  mockQuerySuccess,
  mockQueryError,
  mockNotFound,
  mockProProfile,
  mockLead,
  mockUser,
  validLeadInput,
} from './test-utils';
import {
  AUTH_NOT_AUTHENTICATED,
  LEAD_CREATE_FAILED,
  PROFILE_NOT_FOUND,
  DB_QUERY_FAILED,
  VALIDATION_FAILED,
} from '@/lib/errors';

// Mock Supabase server client
jest.mock('@/lib/supabase/server');
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('Lead Server Actions', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>['mockClient'];
  let queryBuilder: ReturnType<typeof createMockSupabaseClient>['queryBuilder'];

  beforeEach(() => {
    jest.clearAllMocks();
    const mocks = createMockSupabaseClient();
    mockClient = mocks.mockClient;
    queryBuilder = mocks.queryBuilder;
    mockCreateClient.mockResolvedValue(mockClient as unknown as Awaited<ReturnType<typeof createClient>>);
  });

  // ============================================
  // trackLead
  // ============================================
  describe('trackLead', () => {
    const validProId = '123e4567-e89b-12d3-a456-426614174000';

    it('should create lead with valid input', async () => {
      mockQuerySuccess(queryBuilder, mockLead);

      const result = await trackLead(validProId, validLeadInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockLead);
      }
      expect(mockClient.from).toHaveBeenCalledWith('leads');
      expect(queryBuilder.insert).toHaveBeenCalledWith({
        pro_id: validProId,
        contact_name: validLeadInput.contact_name,
        contact_method: validLeadInput.contact_method,
        source_url: validLeadInput.source_url,
        referrer: validLeadInput.referrer,
        is_billable: true,
      });
    });

    it('should handle kakao contact method', async () => {
      mockQuerySuccess(queryBuilder, mockLead);

      const result = await trackLead(validProId, {
        ...validLeadInput,
        contact_method: 'kakao',
      });

      expect(result.success).toBe(true);
    });

    it('should handle phone contact method', async () => {
      mockQuerySuccess(queryBuilder, mockLead);

      const result = await trackLead(validProId, {
        ...validLeadInput,
        contact_method: 'phone',
      });

      expect(result.success).toBe(true);
    });

    it('should handle email contact method', async () => {
      mockQuerySuccess(queryBuilder, mockLead);

      const result = await trackLead(validProId, {
        ...validLeadInput,
        contact_method: 'email',
      });

      expect(result.success).toBe(true);
    });

    it('should handle form contact method', async () => {
      mockQuerySuccess(queryBuilder, mockLead);

      const result = await trackLead(validProId, {
        ...validLeadInput,
        contact_method: 'form',
      });

      expect(result.success).toBe(true);
    });

    it('should return validation error for invalid proId', async () => {
      const result = await trackLead('invalid-id', validLeadInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(VALIDATION_FAILED);
      }
    });

    it('should return error on database failure', async () => {
      queryBuilder.single.mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      });

      const result = await trackLead(validProId, validLeadInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(LEAD_CREATE_FAILED);
      }
    });

    it('should handle optional contact_name', async () => {
      mockQuerySuccess(queryBuilder, { ...mockLead, contact_name: null });

      const result = await trackLead(validProId, {
        contact_method: 'kakao',
      });

      expect(result.success).toBe(true);
    });
  });

  // ============================================
  // getLeadStats
  // ============================================
  describe('getLeadStats', () => {
    const mockProfileStats = {
      total_leads: 50,
      monthly_lead_count: 5,
      subscription_tier: 'free',
    };

    it('should return lead stats for authenticated user', async () => {
      mockAuthenticatedUser(mockClient);
      mockQuerySuccess(queryBuilder, mockProfileStats);

      const result = await getLeadStats();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.total_leads).toBe(50);
        expect(result.data.monthly_leads).toBe(5);
        expect(result.data.is_premium).toBe(false);
        // MONETIZATION PIVOT: All plans now have unlimited leads (999)
        expect(result.data.free_leads_remaining).toBe(999);
      }
    });

    it('should return unlimited leads for all tiers (monetization pivot)', async () => {
      mockAuthenticatedUser(mockClient);
      mockQuerySuccess(queryBuilder, {
        total_leads: 10,
        monthly_lead_count: 1,
        subscription_tier: 'free',
      });

      const result = await getLeadStats();

      expect(result.success).toBe(true);
      if (result.success) {
        // MONETIZATION PIVOT: Even free tier has unlimited leads
        expect(result.data.free_leads_remaining).toBe(999);
      }
    });

    it('should return unlimited leads for premium users', async () => {
      mockAuthenticatedUser(mockClient);
      mockQuerySuccess(queryBuilder, {
        total_leads: 100,
        monthly_lead_count: 50,
        subscription_tier: 'pro',
      });

      const result = await getLeadStats();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.is_premium).toBe(true);
        expect(result.data.free_leads_remaining).toBe(999);
      }
    });

    it('should return error for unauthenticated user', async () => {
      mockUnauthenticatedUser(mockClient);

      const result = await getLeadStats();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(AUTH_NOT_AUTHENTICATED);
      }
    });

    it('should return error when profile not found', async () => {
      mockAuthenticatedUser(mockClient);
      queryBuilder.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      const result = await getLeadStats();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(PROFILE_NOT_FOUND);
      }
    });

    it('should return error on database failure', async () => {
      mockAuthenticatedUser(mockClient);
      queryBuilder.single.mockResolvedValue({
        data: null,
        error: { code: 'DB_ERROR', message: 'Database error' },
      });

      const result = await getLeadStats();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(DB_QUERY_FAILED);
      }
    });
  });

  // ============================================
  // getMyLeads
  // ============================================
  describe('getMyLeads', () => {
    const mockLeads = [
      mockLead,
      { ...mockLead, id: 'lead-456', contact_name: 'Another Customer' },
    ];

    it('should return leads for authenticated user via RPC', async () => {
      mockAuthenticatedUser(mockClient);
      // Now uses get_user_leads RPC function (single query)
      mockClient.rpc.mockResolvedValue({ data: mockLeads, error: null });

      const result = await getMyLeads();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockLeads);
      }
      expect(mockClient.rpc).toHaveBeenCalledWith('get_user_leads', {
        p_user_id: mockUser.id,
        p_limit: 50,
        p_offset: 0,
      });
    });

    it('should apply limit and offset options via RPC', async () => {
      mockAuthenticatedUser(mockClient);
      mockClient.rpc.mockResolvedValue({ data: [mockLead], error: null });

      await getMyLeads({ limit: 5, offset: 10 });

      expect(mockClient.rpc).toHaveBeenCalledWith('get_user_leads', {
        p_user_id: mockUser.id,
        p_limit: 5,
        p_offset: 10,
      });
    });

    it('should return error for unauthenticated user', async () => {
      mockUnauthenticatedUser(mockClient);

      const result = await getMyLeads();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(AUTH_NOT_AUTHENTICATED);
      }
    });

    it('should return error when profile not found via RPC', async () => {
      mockAuthenticatedUser(mockClient);
      mockClient.rpc.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'not found' },
      });

      const result = await getMyLeads();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(PROFILE_NOT_FOUND);
      }
    });

    it('should return empty array when no leads exist', async () => {
      mockAuthenticatedUser(mockClient);
      mockClient.rpc.mockResolvedValue({ data: [], error: null });

      const result = await getMyLeads();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it('should return error on RPC failure', async () => {
      mockAuthenticatedUser(mockClient);
      mockClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      const result = await getMyLeads();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(DB_QUERY_FAILED);
      }
    });
  });

  // ============================================
  // checkLeadLimit
  // ============================================
  describe('checkLeadLimit', () => {
    it('should always allow leads (monetization pivot)', async () => {
      mockQuerySuccess(queryBuilder, {
        monthly_lead_count: 100,
        subscription_tier: 'free',
      });

      const result = await checkLeadLimit('profile-123');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.can_receive_leads).toBe(true);
      }
    });

    it('should allow leads even on database error (fail-open)', async () => {
      mockQueryError(queryBuilder, 'Database error');

      const result = await checkLeadLimit('profile-123');

      // Fail-open: still allows leads
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.can_receive_leads).toBe(true);
      }
    });

    it('should allow leads for premium users', async () => {
      mockQuerySuccess(queryBuilder, {
        monthly_lead_count: 500,
        subscription_tier: 'pro',
      });

      const result = await checkLeadLimit('profile-123');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.can_receive_leads).toBe(true);
      }
    });
  });
});
