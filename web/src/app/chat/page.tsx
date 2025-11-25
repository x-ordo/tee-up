'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useChatRooms } from '@/hooks/useChat';
import { ChatRoomList } from './components/ChatRoomList';

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent" />
          <p className="text-white/60">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-bold text-white">
            TEE<span className="text-[#d4af37]">:</span>UP
          </Link>
          <h1 className="text-lg font-semibold text-white">메시지</h1>
          <div className="w-16" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Mobile: Full list */}
        <div className="flex-1 lg:max-w-md lg:border-r lg:border-white/10">
          <div className="sticky top-[73px] border-b border-white/10 bg-[#0a0e27]/50 p-4 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">대화 목록</h2>
            <p className="text-sm text-white/60">
              {rooms.length}개의 대화
            </p>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <ChatRoomList
              rooms={rooms}
              currentUserId={user.id}
            />
          )}
        </div>

        {/* Desktop: Empty state for right panel */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="text-center">
            <div className="mb-6 text-8xl opacity-20">💬</div>
            <h3 className="mb-2 text-xl font-semibold text-white/60">
              대화를 선택하세요
            </h3>
            <p className="text-white/40">
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
