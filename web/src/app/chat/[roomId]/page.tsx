'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useChatRoom } from '@/hooks/useChat';
import { ChatInput } from '../components/ChatInput';
import {
  MessageBubble,
  TypingIndicator,
  DateDivider,
} from '../components/MessageBubble';
import { isSameDay } from 'date-fns';

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const {
    room,
    messages,
    isLoading,
    isSending,
    error,
    typingUsers,
    send,
    updateTypingStatus,
    changeStatus,
  } = useChatRoom(roomId, user?.id || null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/chat/' + roomId);
    }
  }, [authLoading, isAuthenticated, router, roomId]);

  // 새 메시지 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 그룹화 (날짜별)
  const groupedMessages = useMemo(() => {
    const groups: { date: Date; messages: typeof messages }[] = [];
    let currentGroup: typeof messages = [];
    let currentDate: Date | null = null;

    messages.forEach((msg) => {
      const msgDate = new Date(msg.created_at);

      if (!currentDate || !isSameDay(currentDate, msgDate)) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate!, messages: currentGroup });
        }
        currentDate = msgDate;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0 && currentDate) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  }, [messages]);

  // 상대방 정보
  const otherUser = useMemo(() => {
    if (!room || !user) return null;
    return room.pro_id === user.id ? room.golfer : room.pro;
  }, [room, user]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tee-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
          <p className="text-tee-ink-muted">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (error || !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-tee-background">
        <div className="text-center">
          <div className="mb-4 text-6xl">😢</div>
          <h2 className="mb-2 text-xl font-semibold text-tee-ink-strong">
            채팅방을 찾을 수 없습니다
          </h2>
          <p className="mb-6 text-tee-ink-light">{error || '잘못된 접근입니다.'}</p>
          <Link
            href="/chat"
            className="h-12 rounded-xl bg-tee-accent-primary px-6 py-3 font-medium text-white transition-colors hover:bg-tee-accent-primary-hover inline-flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-tee-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-tee-stone bg-tee-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Back Button */}
          <Link
            href="/chat"
            className="flex h-10 w-10 items-center justify-center rounded-full text-tee-ink-light transition-colors hover:bg-tee-surface hover:text-tee-ink-strong focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* User Info */}
          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              {otherUser?.avatar_url ? (
                <Image
                  src={otherUser.avatar_url}
                  alt={otherUser.full_name || '사용자'}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-tee-accent-primary/10 text-sm font-bold text-tee-accent-primary">
                  {otherUser?.full_name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-medium text-tee-ink-strong">
                {otherUser?.full_name || '알 수 없음'}
              </h2>
              <p className="text-xs text-tee-ink-light">
                {room.status === 'active'
                  ? '문의 중'
                  : room.status === 'matched'
                  ? '매칭 완료'
                  : '종료됨'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {room.status === 'active' && user.role === 'pro' && (
              <button
                onClick={() => changeStatus('matched')}
                className="rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success/20"
              >
                매칭 확정
              </button>
            )}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-tee-ink-light transition-colors hover:bg-tee-surface hover:text-tee-ink-strong focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20"
              aria-label="더보기"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              <DateDivider date={group.date} />
              <div className="space-y-3">
                {group.messages.map((msg, msgIndex) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.sender_id === user.id}
                    sender={msg.sender}
                    showAvatar={
                      msgIndex === 0 ||
                      group.messages[msgIndex - 1]?.sender_id !== msg.sender_id
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <TypingIndicator userName={otherUser?.full_name} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {room.status !== 'closed' ? (
        <ChatInput
          onSend={send}
          onTyping={updateTypingStatus}
          disabled={isSending}
        />
      ) : (
        <div className="border-t border-tee-stone bg-tee-background/90 p-4 text-center backdrop-blur-xl">
          <p className="text-tee-ink-light">이 대화는 종료되었습니다.</p>
        </div>
      )}
    </div>
  );
}
