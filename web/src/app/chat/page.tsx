'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useChatRooms } from '@/hooks/useChat';
import { ChatRoomList } from './components/ChatRoomList';
import { NoConversations } from '@/app/components/EmptyState';
import { ErrorState } from '@/app/components/ErrorState';

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { rooms, isLoading: roomsLoading, error } = useChatRooms(user?.id || null);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/chat');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || roomsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-calm-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-calm-ash">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-calm-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-calm-stone bg-calm-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-bold text-calm-obsidian">
            TEE<span className="text-accent">:</span>UP
          </Link>
          <h1 className="text-lg font-semibold text-calm-obsidian">메시지</h1>
          <div className="w-16" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Mobile: Full list */}
        <div className="flex-1 lg:max-w-md lg:border-r lg:border-calm-stone">
          <div className="sticky top-[73px] border-b border-calm-stone bg-calm-white/80 p-4 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-calm-obsidian">대화 목록</h2>
            <p className="text-sm text-calm-charcoal">
              {rooms.length}개의 대화
            </p>
          </div>

          {error ? (
            <ErrorState
              title="대화를 불러올 수 없습니다"
              description={error}
              showHomeLink={false}
            />
          ) : rooms.length === 0 ? (
            <NoConversations />
          ) : (
            <ChatRoomList
              rooms={rooms}
              currentUserId={user.id}
            />
          )}
        </div>

        {/* Desktop: Empty state for right panel */}
        <div className="hidden flex-1 items-center justify-center bg-calm-cloud lg:flex">
          <div className="text-center">
            <div className="mb-6 text-8xl opacity-20">💬</div>
            <h3 className="mb-2 text-xl font-semibold text-calm-charcoal">
              대화를 선택하세요
            </h3>
            <p className="text-calm-ash">
              왼쪽 목록에서 대화를 선택하면
              <br />
              여기에 메시지가 표시됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
