'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getChatRooms,
  getChatRoom,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
  subscribeToChatRoom,
  subscribeToUserChatRooms,
  subscribeToTypingStatus,
  setTypingStatus,
  unsubscribe,
  createOrGetChatRoom,
  updateChatRoomStatus,
} from '@/lib/chat';
import type { IChatRoom, IMessage, ChatStatus } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// useChatRooms Hook
// ============================================

export function useChatRooms(userId: string | null) {
  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) {
      setRooms([]);
      setIsLoading(false);
      return;
    }

    const loadRooms = async () => {
      try {
        const data = await getChatRooms(userId);
        setRooms(data);
        setError(null);
      } catch {
        setError('채팅방 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();

    // 실시간 구독
    channelRef.current = subscribeToUserChatRooms(userId, (updatedRooms) => {
      setRooms(updatedRooms);
    });

    return () => {
      if (channelRef.current) {
        unsubscribe(channelRef.current);
      }
    };
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const data = await getChatRooms(userId);
    setRooms(data);
    setIsLoading(false);
  }, [userId]);

  return { rooms, isLoading, error, refresh };
}

// ============================================
// useChatRoom Hook
// ============================================

export function useChatRoom(roomId: string | null, userId: string | null) {
  const [room, setRoom] = useState<IChatRoom | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messageChannelRef = useRef<RealtimeChannel | null>(null);
  const roomChannelRef = useRef<RealtimeChannel | null>(null);
  const typingChannelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 채팅방 및 메시지 로드
  useEffect(() => {
    if (!roomId || !userId) {
      setRoom(null);
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [roomData, messagesData] = await Promise.all([
          getChatRoom(roomId),
          getMessages(roomId),
        ]);

        setRoom(roomData);
        setMessages(messagesData);
        setError(null);

        // 메시지 읽음 처리
        if (roomData) {
          await markMessagesAsRead(roomId, userId);
        }
      } catch {
        setError('채팅방을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // 메시지 실시간 구독
    messageChannelRef.current = subscribeToMessages(roomId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      // 새 메시지 읽음 처리
      if (newMessage.sender_id !== userId) {
        markMessagesAsRead(roomId, userId);
      }
    });

    // 채팅방 상태 실시간 구독
    roomChannelRef.current = subscribeToChatRoom(roomId, (updatedRoom) => {
      setRoom(updatedRoom);
    });

    // 타이핑 상태 구독
    typingChannelRef.current = subscribeToTypingStatus(roomId, (users) => {
      setTypingUsers(users.filter((id) => id !== userId));
    });

    return () => {
      if (messageChannelRef.current) unsubscribe(messageChannelRef.current);
      if (roomChannelRef.current) unsubscribe(roomChannelRef.current);
      if (typingChannelRef.current) unsubscribe(typingChannelRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [roomId, userId]);

  // 메시지 전송
  const send = useCallback(
    async (content: string) => {
      if (!roomId || !userId || !content.trim()) return { success: false };

      setIsSending(true);
      const result = await sendMessage(roomId, userId, content);
      setIsSending(false);

      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true };
    },
    [roomId, userId]
  );

  // 타이핑 상태 업데이트
  const updateTypingStatus = useCallback(
    (isTyping: boolean) => {
      if (!roomId || !userId) return;

      // 기존 타이머 클리어
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      setTypingStatus(roomId, userId, isTyping);

      // 3초 후 자동으로 타이핑 상태 해제
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          setTypingStatus(roomId, userId, false);
        }, 3000);
      }
    },
    [roomId, userId]
  );

  // 채팅방 상태 변경
  const changeStatus = useCallback(
    async (status: ChatStatus) => {
      if (!roomId) return { success: false };

      const result = await updateChatRoomStatus(roomId, status);

      if (result.success) {
        setRoom((prev) => (prev ? { ...prev, status } : null));
      }

      return result;
    },
    [roomId]
  );

  return {
    room,
    messages,
    isLoading,
    isSending,
    error,
    typingUsers,
    send,
    updateTypingStatus,
    changeStatus,
  };
}

// ============================================
// useCreateChatRoom Hook
// ============================================

export function useCreateChatRoom() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (proId: string, golferId: string) => {
    setIsCreating(true);
    setError(null);

    const result = await createOrGetChatRoom(proId, golferId);

    setIsCreating(false);

    if (result.error) {
      if (result.error === 'LEAD_LIMIT_EXCEEDED') {
        setError('프로의 무료 문의 한도가 초과되었습니다.');
      } else {
        setError(result.error);
      }
      return { room: null, isNew: false, error: result.error };
    }

    return result;
  }, []);

  return { create, isCreating, error, clearError: () => setError(null) };
}
