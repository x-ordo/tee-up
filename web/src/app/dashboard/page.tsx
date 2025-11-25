'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getLeads, getLeadStats, getLeadTrend, getConversionFunnel } from '@/lib/leads';
import { StatCard, LeadQuotaCard } from './components/StatCard';
import { LeadChart, ConversionFunnel } from './components/LeadChart';
import { LeadList } from './components/LeadList';
import type { ILead, ILeadStats, ITimeSeriesData } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [leads, setLeads] = useState<ILead[]>([]);
  const [stats, setStats] = useState<ILeadStats | null>(null);
  const [trendData, setTrendData] = useState<ITimeSeriesData[]>([]);
  const [funnelData, setFunnelData] = useState<{
    views: number;
    leads: number;
    responded: number;
    matched: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 인증 및 권한 체크
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/dashboard');
      } else if (user?.role !== 'pro') {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  // 데이터 로드
  useEffect(() => {
    if (!user?.id || user.role !== 'pro') return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [leadsData, statsData, trend, funnel] = await Promise.all([
          getLeads(user.id),
          getLeadStats(user.id),
          getLeadTrend(user.id, 30),
          getConversionFunnel(user.id),
        ]);

        setLeads(leadsData);
        setStats(statsData);
        setTrendData(trend.map((t) => ({ date: t.date, value: t.count })));
        setFunnelData(funnel);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id, user?.role]);

  const handleViewChat = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent" />
          <p className="text-white/60">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'pro') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-bold text-white">
            TEE<span className="text-[#d4af37]">:</span>UP
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              메시지
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-white">{user.full_name}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">대시보드</h1>
          <p className="text-white/60">
            리드 현황과 성과를 한눈에 확인하세요
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="총 리드"
            value={stats?.total_leads || 0}
            change={10}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            accentColor="#60A5FA"
          />
          <StatCard
            title="새 문의"
            value={stats?.new_leads || 0}
            change={25}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            accentColor="#FBBF24"
          />
          <StatCard
            title="매칭 완료"
            value={stats?.matched || 0}
            change={15}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            accentColor="#34D399"
          />
          <StatCard
            title="전환율"
            value={`${stats?.conversion_rate || 0}%`}
            change={5}
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            accentColor="#F472B6"
          />
        </div>

        {/* Lead Quota Alert */}
        {stats && stats.lead_limit !== -1 && (
          <div className="mb-8">
            <LeadQuotaCard
              remaining={stats.leads_remaining}
              limit={stats.lead_limit}
              onUpgrade={handleUpgrade}
            />
          </div>
        )}

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <LeadChart data={trendData} title="최근 30일 리드 추이" height={250} />
          {funnelData && <ConversionFunnel data={funnelData} />}
        </div>

        {/* Lead List */}
        <LeadList leads={leads.slice(0, 10)} onViewChat={handleViewChat} />
      </main>
    </div>
  );
}
