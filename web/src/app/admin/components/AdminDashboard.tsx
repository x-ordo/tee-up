import Link from 'next/link'
import { ThemeToggle } from '@/app/components/ThemeToggle'

const adminStats = [
  { label: '대기 중인 프로', value: '12', status: 'warning', link: '/admin/pros/pending' },
  { label: '승인된 프로', value: '47', status: 'success', link: '/admin/pros/approved' },
  { label: '활성 채팅방', value: '23', status: 'info', link: '/admin/chats' },
  { label: '신고된 메시지', value: '3', status: 'error', link: '/admin/reports' },
]

const recentApplications = [
  {
    id: 1,
    name: 'Kim Soo-jin',
    title: 'KLPGA Professional',
    location: 'Seoul',
    appliedAt: '2025-11-23 14:30',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Lee Dong-hyun',
    title: 'PGA Master Professional',
    location: 'Busan',
    appliedAt: '2025-11-23 11:20',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Park Min-ji',
    title: 'Short Game Specialist',
    location: 'Gangnam',
    appliedAt: '2025-11-22 16:45',
    status: 'pending',
  },
]

const recentChats = [
  {
    id: 1,
    golfer: 'James Park',
    pro: 'Hannah Park',
    lastMessage: '네, 이번 주 토요일 오전 10시 가능합니다.',
    timestamp: '5분 전',
    status: 'active',
  },
  {
    id: 2,
    golfer: 'Sarah Kim',
    pro: 'Elliot Kim',
    lastMessage: '레슨 비용은 얼마인가요?',
    timestamp: '23분 전',
    status: 'active',
  },
  {
    id: 3,
    golfer: 'Michael Lee',
    pro: 'Sophia Lee',
    lastMessage: '감사합니다! 확정하겠습니다.',
    timestamp: '1시간 전',
    status: 'matched',
  },
]

interface AdminDashboardProps {
  onLogout?: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-tee-background">
      {/* Admin Header */}
      <header className="border-b border-tee-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-tee-ink-strong">Admin Dashboard</h1>
              <p className="text-body-sm text-tee-ink-muted">시스템 관리 및 모니터링</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/" className="btn-ghost">
                사용자 페이지로
              </Link>
              {onLogout && (
                <button onClick={onLogout} className="h-12 rounded-xl border border-tee-stone bg-tee-surface px-6 py-3 font-medium text-tee-ink-strong transition-colors hover:bg-tee-background">
                  로그아웃
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-tee-stone bg-white">
        <nav className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            <Link
              href="/admin"
              className="border-b-2 border-tee-accent-primary px-4 py-4 text-body-sm font-semibold text-tee-accent-primary"
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
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-tee-ink-light hover:text-tee-accent-primary"
            >
              분석
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Grid */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold text-tee-ink-strong">시스템 현황</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {adminStats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.link}
                className={`rounded-2xl bg-tee-surface shadow-card p-6 group cursor-pointer ${
                  stat.status === 'warning' ? 'border-2 border-warning' :
                  stat.status === 'error' ? 'border-2 border-tee-error' : ''
                }`}
              >
                <div className="font-pretendard text-3xl font-bold text-tee-ink-strong">{stat.value}</div>
                <div className="text-caption text-tee-ink-muted">{stat.label}</div>
                <div className="mt-3 text-body-xs text-tee-accent-primary opacity-0 transition-opacity group-hover:opacity-100">
                  자세히 보기 →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Pro Applications */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-tee-ink-strong">최근 프로 신청</h2>
              <Link href="/admin/pros/pending" className="text-body-sm font-semibold text-tee-accent-primary hover:text-tee-accent-primary-hover">
                전체 보기 →
              </Link>
            </div>

            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="text-left">이름</th>
                    <th className="text-left">직함</th>
                    <th className="text-left">지역</th>
                    <th className="text-left">신청 시간</th>
                    <th className="text-right">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="table-row">
                      <td className="table-cell font-semibold text-tee-ink-strong">{app.name}</td>
                      <td className="table-cell">{app.title}</td>
                      <td className="table-cell">{app.location}</td>
                      <td className="table-cell text-body-xs text-tee-ink-muted">{app.appliedAt}</td>
                      <td className="table-cell text-right">
                        <Link
                          href={`/admin/pros/review/${app.id}`}
                          className="rounded-lg border border-tee-accent-primary bg-tee-accent-primary/10 px-4 py-2 text-body-sm font-medium text-tee-accent-primary hover:bg-tee-accent-primary hover:text-white"
                        >
                          검토
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {recentApplications.length === 0 && (
              <div className="rounded-2xl border border-tee-stone bg-tee-surface/50 p-8 text-center">
                <p className="text-body-md text-tee-ink-muted">대기 중인 신청이 없습니다.</p>
              </div>
            )}
          </section>

          {/* Recent Chats */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-tee-ink-strong">최근 채팅</h2>
              <Link href="/admin/chats" className="text-body-sm font-semibold text-tee-accent-primary hover:text-tee-accent-primary-hover">
                전체 보기 →
              </Link>
            </div>

            <div className="space-y-3">
              {recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/admin/chats/${chat.id}`}
                  className="rounded-2xl bg-tee-surface shadow-card group block"
                >
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-tee-ink-strong">{chat.golfer}</span>
                        <span className="text-tee-ink-muted">↔️</span>
                        <span className="font-semibold text-tee-accent-primary">{chat.pro}</span>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                          chat.status === 'active' ? 'bg-info-bg text-info' :
                          chat.status === 'matched' ? 'bg-success-bg text-success' : ''
                        }`}
                      >
                        {chat.status === 'active' ? '진행 중' : '매칭 완료'}
                      </span>
                    </div>
                    <p className="mb-2 text-body-sm text-tee-ink-light">{chat.lastMessage}</p>
                    <p className="text-body-xs text-tee-ink-muted">{chat.timestamp}</p>
                  </div>
                </Link>
              ))}
            </div>

            {recentChats.length === 0 && (
              <div className="rounded-2xl border border-tee-stone bg-tee-surface/50 p-8 text-center">
                <p className="text-body-md text-tee-ink-muted">활성 채팅이 없습니다.</p>
              </div>
            )}
          </section>
        </div>

        {/* System Alerts */}
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-tee-ink-strong">시스템 알림</h2>
          <div className="space-y-3">
            <div className="alert alert-warning">
              <strong>⚠️ 승인 대기:</strong> 12명의 프로 신청이 검토를 기다리고 있습니다.
              <Link href="/admin/pros/pending" className="ml-2 underline">
                지금 검토하기
              </Link>
            </div>
            <div className="alert alert-error">
              <strong>🚨 신고:</strong> 3개의 메시지가 사용자에 의해 신고되었습니다.
              <Link href="/admin/reports" className="ml-2 underline">
                확인하기
              </Link>
            </div>
            <div className="alert alert-success">
              <strong>✅ 성공:</strong> 오늘 5명의 레슨 매칭이 확정되었습니다.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
