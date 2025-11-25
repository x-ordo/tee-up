/**
 * 채팅 라이브러리
 * @description Supabase Realtime을 사용한 실시간 채팅 기능
 */

import { createClient } from '@/lib/supabase/client';
import type { IChatRoom, IMessage, ChatStatus } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// Constants
// ============================================

export const FREE_LEAD_LIMIT = 3;

// ============================================
// Chat Room Functions
// ============================================

/**
 * 채팅방 목록 조회
 */
export async function getChatRooms(userId: string): Promise<IChatRoom[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      pro:pro_id (id, full_name, avatar_url),
      golfer:golfer_id (id, full_name, avatar_url),
      messages:messages (
        id,
        content,
        sender_id,
        created_at,
        is_read
      )
    `)
    .or(`pro_id.eq.${userId},golfer_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching chat rooms:', error);
    return [];
  }

  // 마지막 메시지와 읽지 않은 메시지 수 계산
  return data.map((room) => {
    const messages = room.messages || [];
    const lastMessage = messages[messages.length - 1];
    const unreadCount = messages.filter(
      (m: { is_read: boolean; sender_id: string }) => !m.is_read && m.sender_id !== userId
    ).length;

    return {
      ...room,
      last_message: lastMessage,
      unread_count: unreadCount,
      messages: undefined, // 상세 메시지는 제외
    };
  });
}

/**
 * 특정 채팅방 조회
 */
export async function getChatRoom(roomId: string): Promise<IChatRoom | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      pro:pro_id (id, full_name, avatar_url, phone),
      golfer:golfer_id (id, full_name, avatar_url, phone)
    `)
    .eq('id', roomId)
    .single();

  if (error) {
    console.error('Error fetching chat room:', error);
    return null;
  }

  return data;
}

/**
 * 채팅방 생성 또는 기존 채팅방 반환
 */
export async function createOrGetChatRoom(
  proId: string,
  golferId: string
): Promise<{ room: IChatRoom | null; isNew: boolean; error?: string }> {
  const supabase = createClient();

  // 기존 채팅방 확인
  const { data: existingRoom } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('pro_id', proId)
    .eq('golfer_id', golferId)
    .single();

  if (existingRoom) {
    return { room: existingRoom, isNew: false };
  }

  // 프로의 월간 채팅 수 확인 (리드 제한)
  const { data: proProfile } = await supabase
    .from('pro_profiles')
    .select('monthly_chat_count, subscription_tier')
    .eq('user_id', proId)
    .single();

  // 무료 티어이고 리드 제한 초과 시
  if (
    proProfile &&
    proProfile.subscription_tier === 'basic' &&
    proProfile.monthly_chat_count >= FREE_LEAD_LIMIT
  ) {
    return {
      room: null,
      isNew: false,
      error: 'LEAD_LIMIT_EXCEEDED',
    };
  }

  // 새 채팅방 생성
  const { data: newRoom, error } = await supabase
    .from('chat_rooms')
    .insert({
      pro_id: proId,
      golfer_id: golferId,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat room:', error);
    return { room: null, isNew: false, error: error.message };
  }

  // 프로의 월간 채팅 수 증가
  await supabase.rpc('increment_chat_count', { profile_id: proId });

  return { room: newRoom, isNew: true };
}

/**
 * 채팅방 상태 업데이트
 */
export async function updateChatRoomStatus(
  roomId: string,
  status: ChatStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const updateData: Record<string, unknown> = { status };

  if (status === 'matched') {
    updateData.matched_at = new Date().toISOString();
  } else if (status === 'closed') {
    updateData.closed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('chat_rooms')
    .update(updateData)
    .eq('id', roomId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// Message Functions
// ============================================

/**
 * 채팅방 메시지 목록 조회
 */
export async function getMessages(
  roomId: string,
  limit = 50,
  offset = 0
): Promise<IMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id (id, full_name, avatar_url)
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

/**
 * 메시지 전송
 */
export async function sendMessage(
  roomId: string,
  senderId: string,
  content: string
): Promise<{ message: IMessage | null; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return { message: null, error: error.message };
  }

  // 채팅방 updated_at 갱신
  await supabase
    .from('chat_rooms')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', roomId);

  return { message: data };
}

/**
 * 메시지 읽음 표시
 */
export async function markMessagesAsRead(
  roomId: string,
  userId: string
): Promise<void> {
  const supabase = createClient();

  await supabase
    .from('messages')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('room_id', roomId)
    .neq('sender_id', userId)
    .eq('is_read', false);
}

/**
 * 메시지 신고
 */
export async function flagMessage(
  messageId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('messages')
    .update({
      is_flagged: true,
      flag_reason: reason,
    })
    .eq('id', messageId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// Realtime Subscriptions
// ============================================

/**
 * 채팅방 메시지 실시간 구독
 */
export function subscribeToMessages(
  roomId: string,
  onNewMessage: (message: IMessage) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onNewMessage(payload.new as IMessage);
      }
    )
    .subscribe();

  return channel;
}

/**
 * 채팅방 상태 변경 실시간 구독
 */
export function subscribeToChatRoom(
  roomId: string,
  onUpdate: (room: IChatRoom) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`room-status:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_rooms',
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        onUpdate(payload.new as IChatRoom);
      }
    )
    .subscribe();

  return channel;
}

/**
 * 사용자의 모든 채팅방 실시간 구독
 */
export function subscribeToUserChatRooms(
  userId: string,
  onUpdate: (rooms: IChatRoom[]) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`user-rooms:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_rooms',
      },
      async () => {
        // 전체 목록 다시 가져오기
        const rooms = await getChatRooms(userId);
        onUpdate(rooms);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      async () => {
        // 새 메시지가 오면 목록 갱신
        const rooms = await getChatRooms(userId);
        onUpdate(rooms);
      }
    )
    .subscribe();

  return channel;
}

/**
 * 구독 해제
 */
export function unsubscribe(channel: RealtimeChannel): void {
  const supabase = createClient();
  supabase.removeChannel(channel);
}

// ============================================
// Typing Indicator (Presence)
// ============================================

/**
 * 타이핑 상태 설정
 */
export function setTypingStatus(
  roomId: string,
  userId: string,
  isTyping: boolean
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase.channel(`typing:${roomId}`);

  channel
    .on('presence', { event: 'sync' }, () => {
      // Presence 동기화
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          is_typing: isTyping,
          online_at: new Date().toISOString(),
        });
      }
    });

  return channel;
}

/**
 * 타이핑 상태 구독
 */
export function subscribeToTypingStatus(
  roomId: string,
  onTypingChange: (typingUsers: string[]) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`typing:${roomId}`)
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const typingUsers = Object.values(state)
        .flat()
        .filter((user: unknown) => (user as { is_typing: boolean }).is_typing)
        .map((user: unknown) => (user as { user_id: string }).user_id);
      onTypingChange(typingUsers);
    })
    .subscribe();

  return channel;
}
