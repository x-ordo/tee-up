import { createClient } from '@/lib/supabase/client'
import {
  getAllProfiles,
  getProfileBySlug,
  createProfile,
  updateProfile,
  incrementProfileViews,
  getPendingProProfiles,
  approveProProfile,
  rejectProProfile,
} from '../profiles'

// Mock Supabase client
jest.mock('@/lib/supabase/client')

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('Profile API', () => {
  let mockSupabaseClient: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Create a fresh mock for each test
    mockSupabaseClient = {
      from: jest.fn(),
      select: jest.fn(),
      eq: jest.fn(),
      single: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      rpc: jest.fn(),
    }

    // Default chaining behavior
    mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.select.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.update.mockReturnValue(mockSupabaseClient)

    mockCreateClient.mockReturnValue(mockSupabaseClient as any)
  })

  describe('getAllProfiles', () => {
    it('should fetch all pro profiles with user data', async () => {
      const mockProfiles = [
        {
          id: '1',
          slug: 'elliot-kim',
          title: 'Signature Performance Architect',
          bio: 'Test bio',
          profile_views: 120,
          user_id: 'user-1',
          profiles: {
            full_name: 'Elliot Kim',
            avatar_url: 'https://example.com/avatar.jpg',
          },
        },
      ]

      // getAllProfiles doesn't call .single(), it directly returns from .select()
      mockSupabaseClient.select.mockResolvedValue({
        data: mockProfiles,
        error: null,
      })

      const result = await getAllProfiles()

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pro_profiles')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*, profiles(full_name, avatar_url)')
      expect(result).toEqual(mockProfiles)
    })

    it('should throw error when database query fails', async () => {
      mockSupabaseClient.select.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      await expect(getAllProfiles()).rejects.toThrow('Database error')
    })
  })

  describe('getProfileBySlug', () => {
    it('should fetch a single profile by slug', async () => {
      const mockProfile = {
        id: '1',
        slug: 'elliot-kim',
        title: 'Signature Performance Architect',
        bio: 'Test bio',
        specialties: ['performance', 'analysis'],
        hero_image_url: 'https://example.com/hero.jpg',
        profile_image_url: 'https://example.com/profile.jpg',
        profile_views: 120,
        monthly_chat_count: 5,
        rating: 4.8,
        subscription_tier: 'pro',
        is_approved: true,
        is_featured: true,
        profiles: {
          full_name: 'Elliot Kim',
          avatar_url: 'https://example.com/avatar.jpg',
          phone: '+821012345678',
        },
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      })

      const result = await getProfileBySlug('elliot-kim')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pro_profiles')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*, profiles(full_name, avatar_url, phone)')
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('slug', 'elliot-kim')
      expect(mockSupabaseClient.single).toHaveBeenCalled()
      expect(result).toEqual(mockProfile)
    })

    it('should return null when profile not found', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }, // Not found error code
      })

      const result = await getProfileBySlug('non-existent')

      expect(result).toBeNull()
    })

    it('should throw error on database error', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Connection error', code: 'OTHER' },
      })

      await expect(getProfileBySlug('elliot-kim')).rejects.toThrow('Connection error')
    })
  })

  describe('createProfile', () => {
    it('should create a new pro profile', async () => {
      const newProfile = {
        user_id: 'user-1',
        slug: 'john-doe',
        title: 'Golf Pro',
        bio: 'Experienced golf instructor',
        specialties: ['putting', 'short-game'],
        hero_image_url: 'https://example.com/hero.jpg',
        profile_image_url: 'https://example.com/profile.jpg',
      }

      const createdProfile = { id: 'profile-1', ...newProfile }

      mockSupabaseClient.single.mockResolvedValue({
        data: createdProfile,
        error: null,
      })

      const result = await createProfile(newProfile)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pro_profiles')
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(newProfile)
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.single).toHaveBeenCalled()
      expect(result).toEqual(createdProfile)
    })

    it('should throw error when slug already exists', async () => {
      const newProfile = {
        user_id: 'user-1',
        slug: 'elliot-kim',
        title: 'Golf Pro',
        bio: 'Test',
        specialties: null,
        hero_image_url: null,
        profile_image_url: null,
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'duplicate key value violates unique constraint', code: '23505' },
      })

      await expect(createProfile(newProfile)).rejects.toThrow()
    })
  })

  describe('updateProfile', () => {
    it('should update an existing profile', async () => {
      const updates = {
        title: 'Updated Title',
        bio: 'Updated bio',
        specialties: ['new-specialty'],
      }

      const updatedProfile = {
        id: 'profile-1',
        slug: 'elliot-kim',
        ...updates,
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: updatedProfile,
        error: null,
      })

      const result = await updateProfile('profile-1', updates)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pro_profiles')
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(updates)
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'profile-1')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.single).toHaveBeenCalled()
      expect(result).toEqual(updatedProfile)
    })

    it('should throw error when profile not found', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })

      await expect(updateProfile('non-existent-id', { title: 'Test' })).rejects.toThrow()
    })
  })

  describe('incrementProfileViews', () => {
    it('should increment profile views count', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: null,
      })

      await incrementProfileViews('profile-1')

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('increment_profile_views', {
        profile_id: 'profile-1',
      })
    })

    it('should throw error on database error', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Function not found' },
      })

      await expect(incrementProfileViews('profile-1')).rejects.toThrow('Function not found')
    })
  })

  describe('Pro Verification - getPendingProProfiles', () => {
    it('should fetch all pending pro applications', async () => {
      const mockPendingPros = [
        {
          id: 'pro-1',
          slug: 'pending-pro-1',
          title: 'Golf Pro Applicant',
          is_approved: false,
          created_at: '2025-11-20T10:00:00Z',
          profiles: {
            full_name: '김민지',
            avatar_url: 'https://example.com/avatar.jpg',
            phone: '+821012345678',
          },
        },
      ]

      // Add order mock
      mockSupabaseClient.order = jest.fn().mockResolvedValue({
        data: mockPendingPros,
        error: null,
      })
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient)

      const result = await getPendingProProfiles()

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pro_profiles')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*, profiles(full_name, avatar_url, phone)')
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('is_approved', false)
      expect(result).toEqual(mockPendingPros)
    })

    it('should throw error on database error', async () => {
      mockSupabaseClient.order = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection error' },
      })
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient)

      await expect(getPendingProProfiles()).rejects.toThrow('Database connection error')
    })
  })

  describe('Pro Verification - approveProProfile', () => {
    it('should approve a pro and set approval timestamp', async () => {
      const mockApprovedPro = {
        id: 'pro-1',
        slug: 'approved-pro',
        title: 'Golf Pro',
        is_approved: true,
        approved_at: '2025-11-25T12:00:00Z',
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: mockApprovedPro,
        error: null,
      })

      const result = await approveProProfile('pro-1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pro_profiles')
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({
        is_approved: true,
        approved_at: expect.any(String),
      })
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'pro-1')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.single).toHaveBeenCalled()
      expect(result).toEqual(mockApprovedPro)
    })

    it('should throw error when pro not found', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      })

      await expect(approveProProfile('non-existent-id')).rejects.toThrow()
    })
  })

  describe('Pro Verification - rejectProProfile', () => {
    it('should delete a pro profile', async () => {
      // rejectProProfile deletes the profile (no return value)
      mockSupabaseClient.delete = jest.fn().mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.eq.mockResolvedValue({
        data: null,
        error: null,
      })

      await rejectProProfile('pro-1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pro_profiles')
      expect(mockSupabaseClient.delete).toHaveBeenCalled()
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'pro-1')
    })

    it('should throw error when pro not found', async () => {
      mockSupabaseClient.delete = jest.fn().mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.eq.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      })

      await expect(rejectProProfile('non-existent-id')).rejects.toThrow()
    })
  })
})
