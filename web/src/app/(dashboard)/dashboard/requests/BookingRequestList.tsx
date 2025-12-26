'use client';

import { useState } from 'react';
import { updateBookingRequestStatus, type BookingRequest, type BookingRequestStatus } from '@/actions';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface BookingRequestListProps {
  initialRequests: BookingRequest[];
}

const STATUS_OPTIONS: { value: BookingRequestStatus; label: string; color: string }[] = [
  { value: 'pending', label: '대기 중', color: 'bg-tee-warning text-white' },
  { value: 'contacted', label: '연락 완료', color: 'bg-tee-info text-white' },
  { value: 'confirmed', label: '레슨 확정', color: 'bg-tee-success text-white' },
  { value: 'cancelled', label: '취소', color: 'bg-tee-error text-white' },
  { value: 'completed', label: '완료', color: 'bg-tee-stone text-tee-ink-strong' },
];

export function BookingRequestList({ initialRequests }: BookingRequestListProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<BookingRequestStatus | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter);

  const handleStatusChange = async (id: string, newStatus: BookingRequestStatus) => {
    setUpdatingId(id);
    const result = await updateBookingRequestStatus(id, newStatus);
    if (result.success) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? result.data : r))
      );
    }
    setUpdatingId(null);
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
    }
    if (phone.length === 10) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}분 전`;
      }
      return `${hours}시간 전`;
    }
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        }
        title="아직 문의가 없습니다"
        description="프로필 페이지를 공유하면 잠재 수강생들이 문의를 보낼 수 있습니다"
        action={
          <Button asChild>
            <a href="/dashboard/portfolio">포트폴리오 공유하기</a>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          전체
        </FilterButton>
        {STATUS_OPTIONS.map((option) => (
          <FilterButton
            key={option.value}
            active={filter === option.value}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </FilterButton>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="rounded-xl bg-tee-surface p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-tee-ink-strong">
                    {request.requester_name}
                  </h3>
                  <StatusBadge status={request.status} />
                </div>

                <a
                  href={`tel:${request.requester_phone}`}
                  className="mt-1 block text-sm text-tee-accent-primary hover:underline"
                >
                  {formatPhone(request.requester_phone)}
                </a>

                {request.preferred_time_text && (
                  <p className="mt-1 text-sm text-tee-ink-light">
                    희망 시간: {request.preferred_time_text}
                  </p>
                )}

                <p className="mt-2 text-xs text-tee-ink-muted">
                  {formatDate(request.created_at)}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === request.id ? null : request.id)
                  }
                  className="rounded-lg p-2 text-tee-ink-light hover:bg-tee-stone/30"
                  aria-label="상세 보기"
                >
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      expandedId === request.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === request.id && (
              <div className="mt-4 space-y-4 border-t border-tee-stone pt-4">
                {/* Message */}
                {request.message && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-tee-ink-muted">
                      문의 내용
                    </p>
                    <p className="text-sm text-tee-ink-light">{request.message}</p>
                  </div>
                )}

                {/* Pro Notes */}
                {request.pro_notes && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-tee-ink-muted">
                      내 메모
                    </p>
                    <p className="text-sm text-tee-ink-light">{request.pro_notes}</p>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <p className="mb-2 text-xs font-medium text-tee-ink-muted">
                    상태 변경
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(request.id, option.value)}
                        disabled={
                          updatingId === request.id ||
                          request.status === option.value
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          request.status === option.value
                            ? option.color
                            : 'bg-tee-stone/30 text-tee-ink-light hover:bg-tee-stone/50'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${request.requester_phone}`}
                    className="flex items-center gap-2 rounded-lg bg-tee-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-tee-accent-primary/90"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    전화하기
                  </a>
                  <a
                    href={`sms:${request.requester_phone}`}
                    className="flex items-center gap-2 rounded-lg border border-tee-stone bg-white px-4 py-2 text-sm font-medium text-tee-ink-strong transition-colors hover:bg-tee-stone/20"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    문자 보내기
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
        active
          ? 'bg-tee-accent-primary text-white'
          : 'bg-tee-stone/30 text-tee-ink-light hover:bg-tee-stone/50'
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: BookingRequestStatus }) {
  const statusConfig = STATUS_OPTIONS.find((s) => s.value === status);
  if (!statusConfig) return null;

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}
    >
      {statusConfig.label}
    </span>
  );
}
