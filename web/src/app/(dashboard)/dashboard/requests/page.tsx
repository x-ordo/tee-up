import { Suspense } from 'react';
import { getMyBookingRequests, getBookingRequestCounts } from '@/actions';
import { BookingRequestList } from './BookingRequestList';

export default async function RequestsPage() {
  const [requestsResult, countsResult] = await Promise.all([
    getMyBookingRequests(),
    getBookingRequestCounts(),
  ]);

  const requests = requestsResult.success ? requestsResult.data : [];
  const counts = countsResult.success
    ? countsResult.data
    : { pending: 0, contacted: 0, confirmed: 0, cancelled: 0, completed: 0, total: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-tee-ink-strong">레슨 문의</h1>
        <p className="text-tee-ink-light">
          잠재 수강생들의 레슨 문의를 관리하세요
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="전체" value={counts.total} color="default" />
        <StatCard label="대기 중" value={counts.pending} color="warning" />
        <StatCard label="연락 완료" value={counts.contacted} color="info" />
        <StatCard label="레슨 확정" value={counts.confirmed} color="success" />
        <StatCard label="완료" value={counts.completed} color="muted" />
      </div>

      {/* Request List */}
      <Suspense fallback={<div className="py-8 text-center">로딩 중...</div>}>
        <BookingRequestList initialRequests={requests} />
      </Suspense>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'default' | 'warning' | 'info' | 'success' | 'muted';
}) {
  const colorClasses = {
    default: 'bg-tee-surface border-tee-stone',
    warning: 'bg-tee-warning/10 border-tee-warning/30',
    info: 'bg-tee-info/10 border-tee-info/30',
    success: 'bg-tee-success/10 border-tee-success/30',
    muted: 'bg-tee-stone/30 border-tee-stone',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <p className="text-sm text-tee-ink-light">{label}</p>
      <p className="text-2xl font-bold text-tee-ink-strong">{value}</p>
    </div>
  );
}
