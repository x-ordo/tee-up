'use client'

import Link from 'next/link'
import { useTimePeriod } from '@/hooks/useTimePeriod'
import { TimePeriodFilter } from './components/TimePeriodFilter'

const kpiMetrics = [
  {
    label: '월간 활성 사용자 (MAU)',
    value: '1,247',
    change: '+18.5%',
    trend: 'up',
    description: '지난 30일 내 로그인한 고유 사용자 수',
  },
  {
    label: '총 레슨 매칭',
    value: '89',
    change: '+12 this month',
    trend: 'up',
    description: '이번 달 확정된 레슨 예약 건수',
  },
  {
    label: '전환율',
    value: '57.1%',
    change: '+5.2%',
    trend: 'up',
    description: '채팅 시작 → 레슨 예약 전환율',
  },
  {
    label: '월간 반복 수익 (MRR)',
    value: '₩2,303,000',
    change: '+₩441,000',
    trend: 'up',
    description: '프로 구독료 기반 월간 반복 수익',
  },
]

const proPerformance = [
  {
    id: 101,
    name: 'Hannah Park',
    profileViews: 247,
    leads: 18,
    matchedLessons: 12,
    conversionRate: 66.7,
    avgResponseTime: '1.2h',
    rating: 4.9,
  },
  {
    id: 102,
    name: 'James Kim',
    profileViews: 189,
    leads: 24,
    matchedLessons: 15,
    conversionRate: 62.5,
    avgResponseTime: '2.8h',
    rating: 4.8,
  },
  {
    id: 103,
    name: 'Sophia Lee',
    profileViews: 156,
    leads: 9,
    matchedLessons: 6,
    conversionRate: 66.7,
    avgResponseTime: '3.5h',
    rating: 4.7,
  },
  {
    id: 104,
    name: 'Michael Choi',
    profileViews: 203,
    leads: 15,
    matchedLessons: 8,
    conversionRate: 53.3,
    avgResponseTime: '4.1h',
    rating: 4.6,
  },
  {
    id: 105,
    name: 'Yuna Kang',
    profileViews: 178,
    leads: 12,
    matchedLessons: 9,
    conversionRate: 75.0,
    avgResponseTime: '1.8h',
    rating: 4.9,
  },
]

const revenueData = [
  { month: '10월', subscriptions: 8, revenue: 392000, newPros: 12 },
  { month: '11월', subscriptions: 12, revenue: 588000, newPros: 8 },
  { month: '12월 (예상)', subscriptions: 18, revenue: 882000, newPros: 14 },
]

export default function AdminAnalyticsPage() {
  const { timePeriod, setTimePeriod } = useTimePeriod('30')

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Admin Header */}
      <header className="border-b border-tee-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-tee-ink-strong">분석</h1>
              <p className="text-body-sm text-tee-ink-muted">플랫폼 성과 및 비즈니스 지표</p>
            </div>
            <Link href="/admin" className="btn-ghost">
              ← 대시보드
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-tee-stone bg-white">
        <nav className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            <Link
              href="/admin"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-tee-ink-light hover:text-tee-accent-primary"
            >
              대시보드
            </Link>
            <Link
              href="/admin/pros"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-tee-ink-light hover:text-tee-accent-primary"
            >
              프로 관리
            </Link>
            <Link
              href="/admin/chats"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-tee-ink-light hover:text-tee-accent-primary"
            >
              채팅 관리
            </Link>
            <Link
              href="/admin/users"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-tee-ink-light hover:text-tee-accent-primary"
            >
              사용자 관리
            </Link>
            <Link
              href="/admin/analytics"
              className="border-b-2 border-tee-accent-primary px-4 py-4 text-body-sm font-semibold text-tee-accent-primary"
            >
              분석
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* KPI Overview */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-tee-ink-strong">핵심 성과 지표</h2>
            <TimePeriodFilter timePeriod={timePeriod} onPeriodChange={setTimePeriod} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {kpiMetrics.map((metric, idx) => (
              <div key={idx} className="rounded-2xl bg-tee-surface shadow-card p-6">
                <p className="mb-2 text-body-sm font-medium text-tee-ink-muted">{metric.label}</p>
                <p className="mb-1 font-display text-3xl font-bold text-tee-ink-strong">
                  {metric.value}
                </p>
                <p
                  className={`mb-3 text-body-sm font-semibold ${
                    metric.trend === 'up' ? 'text-tee-success' : 'text-tee-error'
                  }`}
                >
                  {metric.change}
                </p>
                <p className="text-body-xs text-tee-ink-muted">{metric.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Trends */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-tee-ink-strong">수익 트렌드</h2>
          <div className="rounded-2xl bg-tee-surface shadow-card p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-tee-ink-strong">월별 수익 현황</h3>
            </div>

            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="text-left">월</th>
                    <th className="text-center">구독 중인 프로</th>
                    <th className="text-center">신규 프로 가입</th>
                    <th className="text-right">월 수익</th>
                    <th className="text-right">전월 대비</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((data, idx) => (
                    <tr key={idx} className="table-row">
                      <td className="table-cell font-semibold text-tee-ink-strong">{data.month}</td>
                      <td className="table-cell text-center font-mono">{data.subscriptions}</td>
                      <td className="table-cell text-center font-mono text-success">
                        +{data.newPros}
                      </td>
                      <td className="table-cell text-right font-mono font-semibold text-tee-ink-strong">
                        {data.revenue.toLocaleString('ko-KR')}원
                      </td>
                      <td className="table-cell text-right font-semibold text-success">
                        {idx > 0
                          ? `+${(((data.revenue - revenueData[idx - 1].revenue) / revenueData[idx - 1].revenue) * 100).toFixed(1)}%`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-tee-stone bg-tee-surface/50 p-4">
                <p className="mb-1 text-body-sm text-tee-ink-muted">평균 구독 가격</p>
                <p className="font-display text-2xl font-bold text-tee-ink-strong">₩49,000</p>
              </div>
              <div className="rounded-xl border border-tee-stone bg-tee-surface/50 p-4">
                <p className="mb-1 text-body-sm text-tee-ink-muted">구독 전환율</p>
                <p className="font-display text-2xl font-bold text-tee-ink-strong">25.5%</p>
              </div>
              <div className="rounded-xl border border-tee-stone bg-tee-surface/50 p-4">
                <p className="mb-1 text-body-sm text-tee-ink-muted">이탈률</p>
                <p className="font-display text-2xl font-bold text-tee-ink-strong">4.2%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Performance Leaderboard */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-tee-ink-strong">프로 성과 순위</h2>
          <div className="rounded-2xl bg-tee-surface shadow-card p-6">
            <div className="mb-4">
              <p className="text-body-sm text-tee-ink-muted">
                프로필 조회수, 리드 수, 매칭 성공률 기준
              </p>
            </div>

            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="text-left">순위</th>
                    <th className="text-left">프로 이름</th>
                    <th className="text-center">조회수</th>
                    <th className="text-center">리드</th>
                    <th className="text-center">매칭</th>
                    <th className="text-center">전환율</th>
                    <th className="text-center">평균 응답</th>
                    <th className="text-center">평점</th>
                  </tr>
                </thead>
                <tbody>
                  {proPerformance.map((pro, idx) => (
                    <tr key={pro.id} className="table-row">
                      <td className="table-cell">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
                            idx === 0
                              ? 'bg-warning text-white'
                              : idx === 1
                                ? 'bg-tee-ink-muted text-white'
                                : idx === 2
                                  ? 'bg-warning-bg text-warning'
                                  : 'bg-tee-surface text-tee-ink-light'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div>
                          <p className="font-semibold text-tee-ink-strong">{pro.name}</p>
                          <p className="text-body-xs text-tee-ink-muted">ID: {pro.id}</p>
                        </div>
                      </td>
                      <td className="table-cell text-center font-mono">{pro.profileViews}</td>
                      <td className="table-cell text-center font-mono">{pro.leads}</td>
                      <td className="table-cell text-center font-mono font-semibold text-success">
                        {pro.matchedLessons}
                      </td>
                      <td className="table-cell text-center font-mono font-semibold text-tee-accent-primary">
                        {pro.conversionRate}%
                      </td>
                      <td className="table-cell text-center font-mono text-body-sm">
                        {pro.avgResponseTime}
                      </td>
                      <td className="table-cell text-center font-mono font-semibold text-warning">
                        {pro.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Platform Health */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-tee-ink-strong">플랫폼 상태</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-tee-surface shadow-card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                프로 활동률
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-tee-ink-strong">83.0%</div>
              <p className="mb-4 text-body-sm text-tee-ink-light">
                최근 7일 내 채팅 응답한 프로 비율
              </p>
              <div className="h-2 w-full rounded-full bg-tee-surface">
                <div className="h-2 rounded-full bg-success" style={{ width: '83%' }}></div>
              </div>
            </div>

            <div className="rounded-2xl bg-tee-surface shadow-card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                골퍼 참여도
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-tee-ink-strong">71.5%</div>
              <p className="mb-4 text-body-sm text-tee-ink-light">
                최근 30일 내 활동한 골퍼 비율
              </p>
              <div className="h-2 w-full rounded-full bg-tee-surface">
                <div className="h-2 rounded-full bg-info" style={{ width: '71.5%' }}></div>
              </div>
            </div>

            <div className="rounded-2xl bg-tee-surface shadow-card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                재예약률
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-tee-ink-strong">64.2%</div>
              <p className="mb-4 text-body-sm text-tee-ink-light">
                첫 레슨 후 재예약하는 골퍼 비율
              </p>
              <div className="h-2 w-full rounded-full bg-tee-surface">
                <div className="h-2 rounded-full bg-tee-accent-primary" style={{ width: '64.2%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-tee-surface shadow-card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                평균 레슨 주기
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-tee-ink-strong">
                14.3일
              </div>
              <p className="text-body-sm text-tee-ink-light">
                골퍼가 레슨을 다시 예약하기까지 걸리는 평균 시간
              </p>
              <div className="mt-4 text-body-xs text-success">↓ 1.8일 지난 달 대비 단축</div>
            </div>

            <div className="rounded-2xl bg-tee-surface shadow-card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                프로당 평균 수입
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-tee-ink-strong">
                ₩847,000
              </div>
              <p className="text-body-sm text-tee-ink-light">
                프로 1명이 플랫폼을 통해 얻는 월평균 레슨 수입 (추정)
              </p>
              <div className="mt-4 text-body-xs text-success">↑ ₩124,000 지난 달 대비 증가</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
