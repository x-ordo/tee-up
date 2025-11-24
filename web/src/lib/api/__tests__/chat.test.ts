import { createClient } from '@/lib/supabase/client'
import {
  createChatRoom,
  getChatRooms,
  getChatRoom,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  closeChatRoom,
} from '../chat'

// Mock Supabase client
jest.mock('@/lib/supabase/client')

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('Chat API', () => {
  let mockSupabaseClient: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockSupabaseClient = {
      from: jest.fn(),
      select: jest.fn(),
      eq: jest.fn(),
      neq: jest.fn(),
      or: jest.fn(),
      order: jest.fn(),
      single: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      is: jest.fn(),
      rpc: jest.fn(),
    }

    // Default chaining
    mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.select.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.neq.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.or.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.order.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.update.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.is.mockReturnValue(mockSupabaseClient)

    mockCreateClient.mockReturnValue(mockSupabaseClient as any)
  })

  describe('createChatRoom', () => {
    it('should create a new chat room', async () => {
      const newRoom = {
        id: 'room-1',
        pro_id: 'pro-123',
        golfer_id: 'golfer-456',
        status: 'active',
        created_at: new Date().toISOString(),
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: newRoom,
        error: null,
      })

      const result = await createChatRoom('pro-123', 'golfer-456')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_rooms')
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
        pro_id: 'pro-123',
        golfer_id: 'golfer-456',
        status: 'active',
      })
      expect(result).toEqual(newRoom)
    })

    it('should throw error if room creation fails', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Duplicate room' },
      })

      await expect(createChatRoom('pro-123', 'golfer-456')).rejects.toThrow('Duplicate room')
    })
  })

  describe('getChatRooms', () => {
    it('should fetch all chat rooms for a user', async () => {
      const mockRooms = [
        {
          id: 'room-1',
          pro_id: 'user-1',
          golfer_id: 'user-2',
          status: 'active',
          created_at: '2025-01-01',
        },
        {
          id: 'room-2',
          pro_id: 'user-1',
          golfer_id: 'user-3',
          status: 'matched',
          created_at: '2025-01-02',
        },
      ]

      mockSupabaseClient.order.mockResolvedValue({
        data: mockRooms,
        error: null,
      })

      const result = await getChatRooms('user-1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_rooms')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*')
      expect(result).toEqual(mockRooms)
    })

    it('should filter by user being either pro or golfer', async () => {
      mockSupabaseClient.order.mockResolvedValue({
        data: [],
        error: null,
      })

      await getChatRooms('user-1')

      // Should use .or() filter for pro_id OR golfer_id
      expect(mockSupabaseClient.or).toHaveBeenCalledWith('pro_id.eq.user-1,golfer_id.eq.user-1')
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('updated_at', { ascending: false })
    })
  })

  describe('getChatRoom', () => {
    it('should fetch a single chat room by ID', async () => {
      const mockRoom = {
        id: 'room-1',
        pro_id: 'pro-123',
        golfer_id: 'golfer-456',
        status: 'active',
        created_at: '2025-01-01',
        pro_profile: {
          full_name: 'John Doe',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: mockRoom,
        error: null,
      })

      const result = await getChatRoom('room-1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_rooms')
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'room-1')
      expect(result).toEqual(mockRoom)
    })

    it('should return null if room not found', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })

      const result = await getChatRoom('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('sendMessage', () => {
    it('should send a new message', async () => {
      const newMessage = {
        id: 'msg-1',
        room_id: 'room-1',
        sender_id: 'user-1',
        content: 'Hello!',
        created_at: new Date().toISOString(),
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: newMessage,
        error: null,
      })

      const result = await sendMessage('room-1', 'user-1', 'Hello!')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('messages')
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
        room_id: 'room-1',
        sender_id: 'user-1',
        content: 'Hello!',
      })
      expect(result).toEqual(newMessage)
    })
  })

  describe('getMessages', () => {
    it('should fetch messages for a chat room', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Hello',
          sender_id: 'user-1',
          created_at: '2025-01-01T10:00:00Z',
        },
        {
          id: 'msg-2',
          content: 'Hi',
          sender_id: 'user-2',
          created_at: '2025-01-01T10:01:00Z',
        },
      ]

      mockSupabaseClient.order.mockResolvedValue({
        data: mockMessages,
        error: null,
      })

      const result = await getMessages('room-1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('messages')
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('room_id', 'room-1')
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('created_at', { ascending: true })
      expect(result).toEqual(mockMessages)
    })
  })

  describe('markMessagesAsRead', () => {
    it('should mark messages as read', async () => {
      mockSupabaseClient.is.mockResolvedValue({
        data: null,
        error: null,
      })

      await markMessagesAsRead('room-1', 'user-1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('messages')
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({
        read_at: expect.any(String),
      })
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('room_id', 'room-1')
    })
  })

  describe('closeChatRoom', () => {
    it('should close a chat room', async () => {
      const closedRoom = {
        id: 'room-1',
        status: 'closed',
      }

      mockSupabaseClient.single.mockResolvedValue({
        data: closedRoom,
        error: null,
      })

      const result = await closeChatRoom('room-1')

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_rooms')
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({ status: 'closed' })
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'room-1')
      expect(result).toEqual(closedRoom)
    })
  })
})
