import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import { useAdminAuth } from '../useAdminAuth'
import { createClient } from '@/lib/supabase/client'

// Mock Supabase client
jest.mock('@/lib/supabase/client')

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('useAdminAuth', () => {
  let mockSupabaseClient: any

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Mock Supabase client methods
    mockSupabaseClient = {
      auth: {
        getSession: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
    }

    mockCreateClient.mockReturnValue(mockSupabaseClient as any)
  })

  describe('Authentication State', () => {
    it('should initialize with loading state', () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })

      const { result } = renderHook(() => useAdminAuth())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should set authenticated when session exists', async () => {
      const mockUser = { id: '123', email: 'admin@teeup.com' }
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })

      const { result } = renderHook(() => useAdminAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
    })

    it('should set unauthenticated when no session', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })

      const { result } = renderHook(() => useAdminAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })

  describe('Login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = { id: '123', email: 'admin@teeup.com' }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { user: mockUser } },
        error: null,
      })

      const { result } = renderHook(() => useAdminAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login('admin@teeup.com', 'password123')
      })

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'admin@teeup.com',
        password: 'password123',
      })
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBe('')
    })

    it('should set error on login failure', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      })

      const { result } = renderHook(() => useAdminAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        try {
          await result.current.login('admin@teeup.com', 'wrongpassword')
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should set loading state during login', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
      mockSupabaseClient.auth.signInWithPassword.mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve({
          data: { user: { id: '123' }, session: {} },
          error: null,
        }), 100))
      )

      const { result } = renderHook(() => useAdminAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.login('admin@teeup.com', 'password123')
      })

      // Should be loading immediately after calling login
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })
    })
  })

  describe('Logout', () => {
    it('should successfully logout', async () => {
      const mockUser = { id: '123', email: 'admin@teeup.com' }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      })
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      })

      const { result } = renderHook(() => useAdminAuth())

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })

  describe('Auth State Changes', () => {
    it('should listen to auth state changes', () => {
      const mockUnsubscribe = jest.fn()
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      })

      const { unmount } = renderHook(() => useAdminAuth())

      expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalled()

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })

    it('should update state when auth changes', async () => {
      let authCallback: any

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      })
      mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback: (event: string, session: unknown) => void) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        }
      })

      const { result } = renderHook(() => useAdminAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)

      // Simulate auth state change
      const mockUser = { id: '123', email: 'admin@teeup.com' }
      act(() => {
        authCallback('SIGNED_IN', { user: mockUser })
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toEqual(mockUser)
      })
    })
  })
})
