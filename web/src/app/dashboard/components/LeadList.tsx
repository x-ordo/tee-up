'use client';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import type { ILead } from '@/types';

interface LeadListProps {
  leads: ILead[];
  onViewChat: (roomId: string) => void;
}

export function LeadList({ leads, onViewChat }: LeadListProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-12 text-center">
        <div className="mb-4 text-6xl">📭</div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          아직 리드가 없습니다
        </h3>
        <p className="text-sm text-white/60">
          프로필을 더 매력적으로 꾸며보세요!
          <br />
          골퍼들이 문의를 보내면 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
      <div className="border-b border-white/10 p-4">
        <h3 className="text-lg font-semibold text-white">최근 리드</h3>
        <p className="text-sm text-white/60">{leads.length}개의 문의</p>
      </div>

      <div className="divide-y divide-white/10">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between p-4 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative h-12 w-12 flex-shrink-0">
                {lead.golfer?.avatar_url ? (
                  <Image
                    src={lead.golfer.avatar_url}
                    alt={lead.golfer.full_name || '골퍼'}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4e5c2] text-lg font-bold text-[#0a0e27]">
                    {lead.golfer?.full_name?.charAt(0) || '?'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h4 className="font-medium text-white">
                  {lead.golfer?.full_name || '알 수 없음'}
                </h4>
                <p className="text-sm text-white/60">
                  {formatDistanceToNow(new Date(lead.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  lead.status === 'new'
                    ? 'bg-blue-500/20 text-blue-400'
                    : lead.status === 'matched'
                    ? 'bg-green-500/20 text-green-400'
                    : lead.status === 'contacted'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {lead.status === 'new'
                  ? '새 문의'
                  : lead.status === 'matched'
                  ? '매칭 완료'
                  : lead.status === 'contacted'
                  ? '응답 완료'
                  : '종료'}
              </span>

              {/* Action Button */}
              <button
                onClick={() => onViewChat(lead.chat_room_id)}
                className="rounded-lg border border-[#d4af37]/30 px-4 py-2 text-sm font-medium text-[#d4af37] transition-colors hover:bg-[#d4af37]/10"
              >
                채팅 보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="border-t border-white/10 p-4 text-center">
        <Link
          href="/chat"
          className="text-sm font-medium text-[#d4af37] transition-colors hover:text-[#f4e5c2]"
        >
          모든 채팅 보기 →
        </Link>
      </div>
    </div>
  );
}
