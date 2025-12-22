'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAllDisputes, getPendingRefunds } from '@/actions';
import { formatKRW } from '@/lib/payments';
import type { BookingWithRefund, DisputeStatus } from '@/actions/refunds';

type TabType = 'disputes' | 'refunds';

export default function AdminDisputesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('disputes');
  const [disputes, setDisputes] = useState<BookingWithRefund[]>([]);
  const [pendingRefunds, setPendingRefunds] = useState<BookingWithRefund[]>([]);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [disputesResult, refundsResult] = await Promise.all([
        getAllDisputes(),
        getPendingRefunds(),
      ]);

      if (disputesResult.success) {
        setDisputes(disputesResult.data);
      }
      if (refundsResult.success) {
        setPendingRefunds(refundsResult.data);
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  const filteredDisputes =
    statusFilter === 'all'
      ? disputes
      : disputes.filter((d) => d.dispute_status === statusFilter);

  const getStatusBadge = (status: DisputeStatus | null) => {
    switch (status) {
      case 'opened':
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
            접수됨
          </span>
        );
      case 'pro_responded':
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            프로 응답
          </span>
        );
      case 'escalated':
        return (
          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
            에스컬레이션
          </span>
        );
      case 'resolved_pro':
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            프로 승
          </span>
        );
      case 'resolved_customer':
        return (
          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
            고객 승
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-tee-ink-strong">분쟁 및 환불 관리</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-tee-accent-primary">
              {disputes.filter((d) => d.dispute_status === 'opened').length}
            </div>
            <p className="text-sm text-tee-ink-light">신규 분쟁</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600">
              {disputes.filter((d) => d.dispute_status === 'escalated').length}
            </div>
            <p className="text-sm text-tee-ink-light">에스컬레이션</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-600">{pendingRefunds.length}</div>
            <p className="text-sm text-tee-ink-light">환불 대기</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">
              {
                disputes.filter(
                  (d) =>
                    d.dispute_status === 'resolved_pro' ||
                    d.dispute_status === 'resolved_customer'
                ).length
              }
            </div>
            <p className="text-sm text-tee-ink-light">해결됨</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-tee-stone">
        <button
          onClick={() => setActiveTab('disputes')}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'disputes'
              ? 'border-tee-accent-primary text-tee-accent-primary'
              : 'border-transparent text-tee-ink-light hover:text-tee-ink-strong'
          }`}
        >
          분쟁 ({disputes.length})
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'refunds'
              ? 'border-tee-accent-primary text-tee-accent-primary'
              : 'border-transparent text-tee-ink-light hover:text-tee-ink-strong'
          }`}
        >
          환불 대기 ({pendingRefunds.length})
        </button>
      </div>

      {activeTab === 'disputes' && (
        <>
          {/* Filters */}
          <div className="flex gap-2">
            {(
              ['all', 'opened', 'pro_responded', 'escalated', 'resolved_pro', 'resolved_customer'] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-tee-accent-primary text-white'
                    : 'bg-tee-surface text-tee-ink-light hover:bg-tee-stone'
                }`}
              >
                {status === 'all' && '전체'}
                {status === 'opened' && '접수됨'}
                {status === 'pro_responded' && '프로 응답'}
                {status === 'escalated' && '에스컬레이션'}
                {status === 'resolved_pro' && '프로 승'}
                {status === 'resolved_customer' && '고객 승'}
              </button>
            ))}
          </div>

          {/* Disputes List */}
          {filteredDisputes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-tee-ink-light">분쟁이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDisputes.map((dispute) => (
                <Card
                  key={dispute.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => router.push(`/admin/disputes/${dispute.id}`)}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        예약 #{dispute.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-tee-ink-light">
                        {new Date(dispute.start_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    {getStatusBadge(dispute.dispute_status)}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-tee-ink-light">
                        접수일:{' '}
                        {dispute.dispute_opened_at
                          ? new Date(dispute.dispute_opened_at).toLocaleDateString('ko-KR')
                          : '-'}
                      </div>
                      {dispute.price_amount && (
                        <div className="text-sm font-medium">
                          {formatKRW(dispute.price_amount)}원
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'refunds' && (
        <>
          {pendingRefunds.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-tee-ink-light">환불 대기 중인 요청이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRefunds.map((refund) => (
                <Card
                  key={refund.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => router.push(`/admin/disputes/${refund.id}`)}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        예약 #{refund.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-tee-ink-light">
                        {new Date(refund.start_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                      환불 요청
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-tee-ink-light">
                        요청일:{' '}
                        {refund.refund_requested_at
                          ? new Date(refund.refund_requested_at).toLocaleDateString('ko-KR')
                          : '-'}
                      </div>
                      <div className="text-right">
                        {refund.price_amount && (
                          <p className="text-sm text-tee-ink-light">
                            결제: {formatKRW(refund.price_amount)}원
                          </p>
                        )}
                        <p className="font-medium text-purple-600">
                          환불: {formatKRW(refund.refund_amount)}원
                        </p>
                      </div>
                    </div>
                    {refund.refund_reason && (
                      <p className="mt-2 text-sm text-tee-ink-light">
                        사유: {refund.refund_reason}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
