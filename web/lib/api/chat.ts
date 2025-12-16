import { createClient } from '@/lib/supabase/client'

export type ChatRoom = {
  id: string
  pro_id: string
  golfer_id: string
  status: 'active' | 'matched' | 'closed'
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  room_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

/**
 * Create a new chat room between a pro and golfer
 */
export async function createChatRoom(proId: string, golferId: string): Promise<ChatRoom> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('chat_rooms')
    .insert({
      pro_id: proId,
      golfer_id: golferId,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Get all chat rooms for a user (either as pro or golfer)
 */
export async function getChatRooms(userId: string): Promise<ChatRoom[]> {
  const supabase = createClient()

  // Get rooms where user is either pro or golfer
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .or(`pro_id.eq.${userId},golfer_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Get a single chat room by ID with participant info
 */
export async function getChatRoom(roomId: string): Promise<ChatRoom | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('chat_rooms')
    .select(
      `
      *,
      pro_profile:profiles!chat_rooms_pro_id_fkey(full_name, avatar_url),
      golfer_profile:profiles!chat_rooms_golfer_id_fkey(full_name, avatar_url)
    `
    )
    .eq('id', roomId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(error.message)
  }

  return data
}

/**
 * Send a message in a chat room
 */
export async function sendMessage(roomId: string, senderId: string, content: string): Promise<Message> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      content,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Update chat room's updated_at timestamp
  await supabase.from('chat_rooms').update({ updated_at: new Date().toISOString() }).eq('id', roomId)

  return data
}

/**
 * Get all messages for a chat room
 */
export async function getMessages(roomId: string): Promise<Message[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Mark messages as read for a user
 */
export async function markMessagesAsRead(roomId: string, userId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('room_id', roomId)
    .neq('sender_id', userId) // Don't mark own messages as read
    .is('read_at', null) // Only update unread messages

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Close a chat room (change status to closed)
 */
export async function closeChatRoom(roomId: string): Promise<ChatRoom> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('chat_rooms')
    .update({ status: 'closed' })
    .eq('id', roomId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Subscribe to new messages in a chat room
 * Returns an unsubscribe function
 */
export function subscribeToMessages(
  roomId: string,
  onNewMessage: (message: Message) => void
): () => void {
  const supabase = createClient()

  const channel = supabase
    .channel(`messages:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// ========================================
// Admin Functions for Chat Management
// ========================================

export type ChatRoomWithDetails = ChatRoom & {
  pro_profile: {
    full_name: string
    avatar_url: string | null
    phone: string | null
  }
  golfer_profile: {
    full_name: string
    avatar_url: string | null
    phone: string | null
  }
  last_message?: {
    content: string
    created_at: string
  }
  unread_count?: number
}

export type FlaggedMessage = {
  id: string
  room_id: string
  sender_id: string
  content: string
  is_flagged: boolean
  flag_reason: string | null
  created_at: string
  sender?: {
    full_name: string
  }
}

export type ChatStats = {
  total_rooms: number
  active_rooms: number
  matched_rooms: number
  flagged_messages: number
}

/**
 * Get all chat rooms with details - Admin only
 */
export async function getAllChatRooms(): Promise<ChatRoomWithDetails[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      pro_profile:profiles!chat_rooms_pro_id_fkey(full_name, avatar_url, phone),
      golfer_profile:profiles!chat_rooms_golfer_id_fkey(full_name, avatar_url, phone)
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Get flagged messages - Admin only
 */
export async function getFlaggedMessages(): Promise<FlaggedMessage[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(full_name)
    `)
    .eq('is_flagged', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Dismiss a flagged message - Admin only
 */
export async function dismissFlaggedMessage(messageId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('messages')
    .update({
      is_flagged: false,
      flag_reason: null,
    })
    .eq('id', messageId)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Delete a flagged message - Admin only
 */
export async function deleteFlaggedMessage(messageId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Get chat statistics - Admin only
 */
export async function getChatStats(): Promise<ChatStats> {
  const supabase = createClient()

  // Get room counts by status
  const { data: rooms, error: roomsError } = await supabase
    .from('chat_rooms')
    .select('status')

  if (roomsError) {
    throw new Error(roomsError.message)
  }

  // Get flagged message count
  const { count: flaggedCount, error: flaggedError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_flagged', true)

  if (flaggedError) {
    throw new Error(flaggedError.message)
  }

  const total = rooms?.length || 0
  const active = rooms?.filter(r => r.status === 'active').length || 0
  const matched = rooms?.filter(r => r.status === 'matched').length || 0

  return {
    total_rooms: total,
    active_rooms: active,
    matched_rooms: matched,
    flagged_messages: flaggedCount || 0,
  }
}

/**
 * Update chat room status - Admin only
 */
export async function updateChatRoomStatus(
  roomId: string,
  status: 'active' | 'matched' | 'closed'
): Promise<ChatRoom> {
  const supabase = createClient()

  const updateData: Record<string, string> = { status }

  if (status === 'matched') {
    updateData.matched_at = new Date().toISOString()
  } else if (status === 'closed') {
    updateData.closed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('chat_rooms')
    .update(updateData)
    .eq('id', roomId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
