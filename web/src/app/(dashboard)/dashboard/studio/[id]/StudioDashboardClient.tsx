'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  TrendingUp,
  Copy,
  Check,
  UserMinus,
  LinkIcon,
  RefreshCw,
  Crown,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  type Studio,
  type StudioDashboardStats,
  type StudioInvite,
  createStudioInvite,
  getStudioInvites,
  revokeStudioInvite,
  removeStudioMember,
  getStudioDashboardStats,
} from '@/actions/studios';

interface StudioDashboardClientProps {
  studio: Studio;
  initialStats: StudioDashboardStats | null;
}

export function StudioDashboardClient({
  studio,
  initialStats,
}: StudioDashboardClientProps) {
  const [stats, setStats] = useState<StudioDashboardStats | null>(initialStats);
  const [invites, setInvites] = useState<StudioInvite[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'invites'>('overview');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRefreshStats = () => {
    startTransition(async () => {
      const result = await getStudioDashboardStats(studio.id);
      if (result.success && result.data) {
        setStats(result.data);
      }
    });
  };

  const handleLoadInvites = () => {
    startTransition(async () => {
      const result = await getStudioInvites(studio.id);
      if (result.success) {
        setInvites(result.data);
      }
    });
  };

  const handleCreateInvite = () => {
    startTransition(async () => {
      setError(null);
      const result = await createStudioInvite(studio.id, {
        maxUses: 1,
        expiresInDays: 7,
      });
      if (result.success) {
        setInvites((prev) => [result.data, ...prev]);
      } else {
        setError(result.error || '초대 링크 생성에 실패했습니다.');
      }
    });
  };

  const handleRevokeInvite = (inviteId: string) => {
    startTransition(async () => {
      const result = await revokeStudioInvite(inviteId);
      if (result.success) {
        setInvites((prev) =>
          prev.map((inv) =>
            inv.id === inviteId ? { ...inv, status: 'revoked' as const } : inv
          )
        );
      }
    });
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (!confirm(`${memberName} 프로를 스튜디오에서 제외하시겠습니까?`)) {
      return;
    }

    startTransition(async () => {
      const result = await removeStudioMember(studio.id, memberId);
      if (result.success) {
        handleRefreshStats();
      } else {
        setError(result.error || '멤버 제외에 실패했습니다.');
      }
    });
  };

  const copyInviteLink = async (token: string) => {
    const link = `${window.location.origin}/studio/join/${token}`;
    await navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Header */}
      <header className="bg-tee-surface border-b border-tee-stone">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-tee-ink-strong">
                {studio.name}
              </h1>
              <p className="text-sm text-tee-ink-light mt-1">
                스튜디오 대시보드
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStats}
              disabled={isPending}
            >
              <RefreshCw
                className={cn('h-4 w-4 mr-2', isPending && 'animate-spin')}
              />
              새로고침
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'overview'
                  ? 'border-tee-accent-primary text-tee-accent-primary'
                  : 'border-transparent text-tee-ink-light hover:text-tee-ink-strong'
              )}
            >
              개요
            </button>
            <button
              onClick={() => {
                setActiveTab('invites');
                if (invites.length === 0) {
                  handleLoadInvites();
                }
              }}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'invites'
                  ? 'border-tee-accent-primary text-tee-accent-primary'
                  : 'border-transparent text-tee-ink-light hover:text-tee-ink-strong'
              )}
            >
              초대 관리
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline"
            >
              닫기
            </button>
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            onRemoveMember={handleRemoveMember}
            formatCurrency={formatCurrency}
            isPending={isPending}
          />
        )}

        {activeTab === 'invites' && (
          <InvitesTab
            invites={invites}
            onCreateInvite={handleCreateInvite}
            onRevokeInvite={handleRevokeInvite}
            onCopyLink={copyInviteLink}
            copiedToken={copiedToken}
            isPending={isPending}
          />
        )}
      </main>
    </div>
  );
}

// ============================================
// Overview Tab
// ============================================

interface OverviewTabProps {
  stats: StudioDashboardStats | null;
  onRemoveMember: (memberId: string, memberName: string) => void;
  formatCurrency: (amount: number) => string;
  isPending: boolean;
}

function OverviewTab({
  stats,
  onRemoveMember,
  formatCurrency,
  isPending,
}: OverviewTabProps) {
  if (!stats) {
    return (
      <div className="text-center py-12 text-tee-ink-light">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={Users}
          label="소속 프로"
          value={stats.total_members.toString()}
          subtext="명"
        />
        <SummaryCard
          icon={Calendar}
          label="이번 달 예약"
          value={stats.bookings_this_month.toString()}
          subtext="건"
        />
        <SummaryCard
          icon={TrendingUp}
          label="추정 매출"
          value={formatCurrency(stats.revenue_estimate)}
          subtext=""
        />
      </div>

      {/* Members Table */}
      <div className="bg-tee-surface rounded-xl border border-tee-stone overflow-hidden">
        <div className="px-6 py-4 border-b border-tee-stone">
          <h2 className="text-lg font-semibold text-tee-ink-strong">
            소속 프로 현황
          </h2>
        </div>

        {stats.members.length === 0 ? (
          <div className="px-6 py-12 text-center text-tee-ink-light">
            아직 소속된 프로가 없습니다.
            <br />
            초대 링크를 생성하여 프로를 초대해보세요.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-tee-stone/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-tee-ink-light uppercase tracking-wider">
                    프로
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-tee-ink-light uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-tee-ink-light uppercase tracking-wider">
                    이번 달 예약
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-tee-ink-light uppercase tracking-wider">
                    추정 매출
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-tee-ink-light uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tee-stone">
                {stats.members.map((member) => (
                  <tr key={member.pro_profile_id} className="hover:bg-tee-stone/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.profile_image_url ? (
                          <img
                            src={member.profile_image_url}
                            alt={member.pro_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-tee-stone flex items-center justify-center">
                            <Users className="w-5 h-5 text-tee-ink-muted" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/${member.pro_slug}`}
                            className="font-medium text-tee-ink-strong hover:text-tee-accent-primary"
                          >
                            {member.pro_name}
                          </Link>
                          <p className="text-xs text-tee-ink-muted">
                            가입: {format(new Date(member.joined_at), 'yyyy.MM.dd', { locale: ko })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.role === 'owner' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-tee-accent-secondary/10 text-tee-accent-secondary text-xs font-medium">
                          <Crown className="w-3 h-3" />
                          원장
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-tee-stone text-tee-ink-light text-xs font-medium">
                          멤버
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-tee-ink-strong">
                        {member.bookings_this_month}
                      </span>
                      <span className="text-sm text-tee-ink-light"> 건</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-tee-ink-strong">
                      {formatCurrency(member.revenue_estimate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {member.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onRemoveMember(member.pro_profile_id, member.pro_name)
                          }
                          disabled={isPending}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Invites Tab
// ============================================

interface InvitesTabProps {
  invites: StudioInvite[];
  onCreateInvite: () => void;
  onRevokeInvite: (inviteId: string) => void;
  onCopyLink: (token: string) => void;
  copiedToken: string | null;
  isPending: boolean;
}

function InvitesTab({
  invites,
  onCreateInvite,
  onRevokeInvite,
  onCopyLink,
  copiedToken,
  isPending,
}: InvitesTabProps) {
  return (
    <div className="space-y-6">
      {/* Create Invite Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-tee-ink-strong">
            초대 링크 관리
          </h2>
          <p className="text-sm text-tee-ink-light mt-1">
            초대 링크를 생성하여 프로를 스튜디오에 초대하세요.
          </p>
        </div>
        <Button onClick={onCreateInvite} disabled={isPending}>
          <LinkIcon className="w-4 h-4 mr-2" />
          초대 링크 생성
        </Button>
      </div>

      {/* Invites List */}
      <div className="bg-tee-surface rounded-xl border border-tee-stone overflow-hidden">
        {invites.length === 0 ? (
          <div className="px-6 py-12 text-center text-tee-ink-light">
            생성된 초대 링크가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-tee-stone">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-tee-stone/50 px-2 py-1 rounded font-mono">
                      {invite.token.substring(0, 12)}...
                    </code>
                    <StatusBadge status={invite.status} expiresAt={invite.expires_at} />
                  </div>
                  <p className="text-xs text-tee-ink-muted mt-1">
                    생성: {format(new Date(invite.created_at), 'yyyy.MM.dd HH:mm', { locale: ko })}
                    {' · '}
                    만료: {format(new Date(invite.expires_at), 'yyyy.MM.dd HH:mm', { locale: ko })}
                    {' · '}
                    사용: {invite.use_count}/{invite.max_uses ?? '무제한'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {invite.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCopyLink(invite.token)}
                      >
                        {copiedToken === invite.token ? (
                          <>
                            <Check className="w-4 h-4 mr-1 text-green-500" />
                            복사됨
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            복사
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevokeInvite(invite.id)}
                        disabled={isPending}
                        className="text-red-500 hover:text-red-700"
                      >
                        취소
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function SummaryCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="bg-tee-surface rounded-xl border border-tee-stone p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-tee-accent-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-tee-accent-primary" />
        </div>
        <span className="text-sm font-medium text-tee-ink-light">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-tee-ink-strong">{value}</span>
        {subtext && <span className="text-tee-ink-light">{subtext}</span>}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  expiresAt,
}: {
  status: StudioInvite['status'];
  expiresAt: string;
}) {
  const isExpired = new Date(expiresAt) < new Date();

  if (status === 'revoked') {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
        취소됨
      </span>
    );
  }

  if (status === 'accepted') {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
        사용됨
      </span>
    );
  }

  if (isExpired || status === 'expired') {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
        만료됨
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
      활성
    </span>
  );
}
