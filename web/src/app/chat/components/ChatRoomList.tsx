'use client';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import type { IChatRoom } from '@/types';

interface ChatRoomListProps {
  rooms: IChatRoom[];
  currentRoomId?: string;
  currentUserId: string;
}

export function ChatRoomList({
  rooms,
  currentRoomId,
  currentUserId,
}: ChatRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-6xl">💬</div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          아직 대화가 없습니다
        </h3>
        <p className="text-sm text-white/60">
          프로 프로필에서 문의하기를 통해
          <br />
          대화를 시작해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {rooms.map((room) => {
        const otherUser =
          room.pro_id === currentUserId ? room.golfer : room.pro;
        const isActive = room.id === currentRoomId;

        return (
          <Link
            key={room.id}
            href={`/chat/${room.id}`}
            className={`
              flex items-center gap-4 p-4 transition-colors
              ${
                isActive
                  ? 'bg-[#d4af37]/20'
                  : 'hover:bg-white/5'
              }
            `}
          >
            {/* Avatar */}
            <div className="relative h-12 w-12 flex-shrink-0">
              {otherUser?.avatar_url ? (
                <Image
                  src={otherUser.avatar_url}
                  alt={otherUser.full_name || '사용자'}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e5c2] text-lg font-bold text-[#0a0e27]">
                  {otherUser?.full_name?.charAt(0) || '?'}
                </div>
              )}

              {/* Status Indicator */}
              {room.status === 'matched' && (
                <div className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1">
                  <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">
                  {otherUser?.full_name || '알 수 없음'}
                </h4>
                {room.last_message && (
                  <span className="text-xs text-white/40">
                    {formatDistanceToNow(new Date(room.last_message.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="truncate text-sm text-white/60">
                  {room.last_message?.content || '대화를 시작해보세요'}
                </p>
                {room.unread_count && room.unread_count > 0 && (
                  <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#d4af37] px-1.5 text-xs font-bold text-[#0a0e27]">
                    {room.unread_count > 99 ? '99+' : room.unread_count}
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-1">
                <span
                  className={`
                    inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                    ${
                      room.status === 'active'
                        ? 'bg-blue-500/20 text-blue-400'
                        : room.status === 'matched'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }
                  `}
                >
                  {room.status === 'active'
                    ? '문의 중'
                    : room.status === 'matched'
                    ? '매칭 완료'
                    : '종료됨'}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
