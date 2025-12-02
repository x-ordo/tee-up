import Link from 'next/link'

const users = [
  {
    id: 1,
    name: 'Park Ji-sung',
    email: 'jisung.park@email.com',
    phone: '010-9876-5432',
    role: 'golfer',
    joinedAt: '2025-11-15 14:30',
    status: 'active',
    lessonsBooked: 5,
    totalSpent: '₩1,400,000',
  },
  {
    id: 2,
    name: 'Kim Min-jae',
    email: 'minjae.kim@email.com',
    phone: '010-8765-4321',
    role: 'golfer',
    joinedAt: '2025-11-10 09:20',
    status: 'active',
    lessonsBooked: 3,
    totalSpent: '₩840,000',
  },
  {
    id: 101,
    name: 'Hannah Park',
    email: 'hannah.park@email.com',
    phone: '010-1111-2222',
    role: 'pro',
    joinedAt: '2025-10-05 11:15',
    status: 'active',
    lessonsGiven: 24,
    subscriptionTier: 'pro',
  },
  {
    id: 102,
    name: 'James Kim',
    email: 'james.kim@email.com',
    phone: '010-3333-4444',
    role: 'pro',
    joinedAt: '2025-10-12 16:45',
    status: 'active',
    lessonsGiven: 31,
    subscriptionTier: 'pro',
  },
  {
    id: 3,
    name: 'Lee Soo-hyun',
    email: 'soohyun.lee@email.com',
    phone: '010-7654-3210',
    role: 'golfer',
    joinedAt: '2025-11-24 11:45',
    status: 'active',
    lessonsBooked: 0,
    totalSpent: '₩0',
  },
  {
    id: 103,
    name: 'Sophia Lee',
    email: 'sophia.lee@email.com',
    phone: '010-5555-6666',
    role: 'pro',
    joinedAt: '2025-10-20 13:30',
    status: 'active',
    lessonsGiven: 12,
    subscriptionTier: 'basic',
  },
]

const userStats = [
  { label: '전체 사용자', value: '264', change: '+18 this week' },
  { label: '골퍼', value: '217', change: '82.2% of total' },
  { label: '프로', value: '47', change: '17.8% of total' },
  { label: '이번 주 가입', value: '18', change: '↑ 12% from last week' },
]

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-calm-white">
      {/* Admin Header */}
      <header className="border-b border-calm-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-calm-obsidian">사용자 관리</h1>
              <p className="text-body-sm text-calm-ash">플랫폼 사용자 계정 및 활동 관리</p>
            </div>
            <Link href="/admin" className="btn-ghost">
              ← 대시보드
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-calm-stone bg-white">
        <nav className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            <Link
              href="/admin"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-calm-charcoal hover:text-accent"
            >
              대시보드
            </Link>
            <Link
              href="/admin/pros"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-calm-charcoal hover:text-accent"
            >
              프로 관리
            </Link>
            <Link
              href="/admin/chats"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-calm-charcoal hover:text-accent"
            >
              채팅 관리
            </Link>
            <Link
              href="/admin/users"
              className="border-b-2 border-accent px-4 py-4 text-body-sm font-semibold text-accent"
            >
              사용자 관리
            </Link>
            <Link
              href="/admin/analytics"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-calm-charcoal hover:text-accent"
            >
              분석
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {userStats.map((stat, idx) => (
              <div key={idx} className="card p-6">
                <p className="mb-2 text-body-sm font-medium text-calm-ash">{stat.label}</p>
                <p className="mb-1 font-display text-3xl font-bold text-calm-obsidian">
                  {stat.value}
                </p>
                <p className="text-body-xs text-calm-charcoal">{stat.change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Users Table */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-calm-obsidian">
              사용자 목록 ({users.length})
            </h2>
            <input
              type="search"
              placeholder="이름, 이메일, 전화번호 검색..."
              className="input w-64"
            />
          </div>

          <div className="table-container relative">
            {/* Scroll hint for mobile */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden" aria-hidden="true" />
            <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left">ID</th>
                  <th className="text-left">이름</th>
                  <th className="text-left">연락처</th>
                  <th className="text-center">역할</th>
                  <th className="text-center">활동</th>
                  <th className="text-center">가입일</th>
                  <th className="text-center">상태</th>
                  <th className="text-right">작업</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="table-cell font-mono font-semibold text-accent">
                      {user.id}
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-calm-obsidian">{user.name}</p>
                        <p className="text-body-xs text-calm-ash">{user.email}</p>
                      </div>
                    </td>
                    <td className="table-cell font-mono text-body-sm">{user.phone}</td>
                    <td className="table-cell text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                          user.role === 'pro'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-calm-cloud text-calm-charcoal'
                        }`}
                      >
                        {user.role === 'pro' ? '프로' : '골퍼'}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      {user.role === 'pro' ? (
                        <div>
                          <p className="font-mono font-semibold text-calm-obsidian">
                            {user.lessonsGiven}
                          </p>
                          <p className="text-body-xs text-calm-ash">레슨 진행</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-mono font-semibold text-calm-obsidian">
                            {user.lessonsBooked}
                          </p>
                          <p className="text-body-xs text-calm-ash">레슨 예약</p>
                        </div>
                      )}
                    </td>
                    <td className="table-cell text-center text-body-xs text-calm-ash">
                      {user.joinedAt}
                    </td>
                    <td className="table-cell text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-success-bg text-success'
                            : 'bg-calm-cloud text-calm-charcoal'
                        }`}
                      >
                        {user.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button className="rounded-lg border border-accent bg-accent/10 px-4 py-2 text-body-sm font-medium text-accent hover:bg-accent hover:text-white">
                        관리
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </section>

        {/* User Insights */}
        <section className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-calm-obsidian">사용자 인사이트</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
                활성 사용자 비율
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-calm-obsidian">87.5%</div>
              <p className="text-body-sm text-calm-charcoal">
                최근 30일 내 로그인한 사용자
              </p>
              <div className="mt-4 text-body-xs text-success">↑ 3.2% 지난 달 대비 상승</div>
            </div>

            <div className="card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
                골퍼당 평균 레슨
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-calm-obsidian">2.8회</div>
              <p className="text-body-sm text-calm-charcoal">
                골퍼 1명당 평균 예약 레슨 수
              </p>
              <div className="mt-4 text-body-xs text-success">↑ 0.6회 지난 분기 대비 증가</div>
            </div>

            <div className="card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
                신규 사용자 유지율
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-calm-obsidian">64.2%</div>
              <p className="text-body-sm text-calm-charcoal">
                가입 후 30일 내 재방문 비율
              </p>
              <div className="mt-4 text-body-xs text-warning">↓ 2.1% 지난 달 대비 하락</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
