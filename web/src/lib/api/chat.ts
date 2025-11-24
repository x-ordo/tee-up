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
