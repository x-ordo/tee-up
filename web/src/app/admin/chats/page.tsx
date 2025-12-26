'use client'

import Link from 'next/link'
import { useFlaggedMessages } from '@/hooks/useFlaggedMessages'
import { useChatManagement } from '@/hooks/useChatManagement'
import { FlaggedMessageCard } from './components/FlaggedMessageCard'

export default function AdminChatsPage() {
  const {
    flaggedMessages,
    processingId,
    isLoading: flaggedLoading,
    error: flaggedError,
    handleAction,
    handleDismiss,
  } = useFlaggedMessages()

  const {
    chatRooms,
    stats,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatManagement()

  const isLoading = flaggedLoading || chatsLoading
  const error = flaggedError || chatsError

  const chatStats = [
    {
      label: '전체 채팅방',
      value: stats.totalRooms.toString(),
      change: `${stats.activeRooms} active`,
    },
    {
      label: '활성 대화',
      value: stats.activeRooms.toString(),
      change: stats.totalRooms > 0
        ? `${((stats.activeRooms / stats.totalRooms) * 100).toFixed(1)}% of total`
        : '0% of total',
    },
    {
      label: '매칭 완료',
      value: stats.matchedRooms.toString(),
      change: stats.totalRooms > 0
        ? `${((stats.matchedRooms / stats.totalRooms) * 100).toFixed(1)}% conversion`
        : '0% conversion',
    },
    {
      label: '신고된 메시지',
      value: stats.flaggedMessages.toString(),
      change: `${flaggedMessages.filter((m) => m.status === 'pending').length} pending review`,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tee-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent"></div>
          <p className="text-tee-ink-muted">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Admin Header */}
      <header className="border-b border-tee-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-tee-ink-strong">채팅 관리</h1>
              <p className="text-body-sm text-tee-ink-muted">실시간 대화 모니터링 및 중재</p>
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
              className="border-b-2 border-tee-accent-primary px-4 py-4 text-body-sm font-semibold text-tee-accent-primary"
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
        {/* Error Alert */}
        {error && (
          <div role="alert" aria-live="polite" className="alert-error mb-6">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {chatStats.map((stat, idx) => (
              <div key={idx} className="rounded-2xl bg-tee-surface shadow-card p-6">
                <p className="mb-2 text-body-sm font-medium text-tee-ink-muted">{stat.label}</p>
                <p className="mb-1 font-display text-3xl font-bold text-tee-ink-strong">
                  {stat.value}
                </p>
                <p className="text-body-xs text-tee-ink-light">{stat.change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flagged Messages Section */}
        {flaggedMessages.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-tee-ink-strong">
                신고된 메시지 ({flaggedMessages.length})
              </h2>
            </div>

            <div className="space-y-4">
              {flaggedMessages.map((msg) => (
                <FlaggedMessageCard
                  key={msg.id}
                  message={msg}
                  onAction={handleAction}
                  onDismiss={handleDismiss}
                  isProcessing={processingId === msg.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Active Chat Rooms Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-tee-ink-strong">
              채팅방 목록 ({chatRooms.length})
            </h2>
            <input type="search" placeholder="골퍼/프로 이름 검색..." className="input w-64" />
          </div>

          <div className="table-container relative overflow-x-auto">
            {/* Scroll hint for mobile */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden" aria-hidden="true" />
            <table className="min-w-[800px] w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left">채팅방 ID</th>
                  <th className="text-left">골퍼</th>
                  <th className="text-left">프로</th>
                  <th className="text-left">마지막 메시지</th>
                  <th className="text-center">읽지 않음</th>
                  <th className="text-center">상태</th>
                  <th className="text-center">생성일</th>
                  <th className="text-right">작업</th>
                </tr>
              </thead>
              <tbody>
                {chatRooms.map((room) => (
                  <tr key={room.id} className="table-row">
                    <td className="table-cell font-mono font-semibold text-tee-accent-primary">
                      #{room.id.slice(0, 8)}
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-tee-ink-strong">{room.golferName}</p>
                        <p className="text-body-xs text-tee-ink-muted">{room.golferPhone || '-'}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-tee-ink-strong">{room.proName}</p>
                        <p className="text-body-xs text-tee-ink-muted">ID: {room.proId.slice(0, 8)}</p>
                      </div>
                    </td>
                    <td className="table-cell max-w-xs">
                      <div>
                        <p className="truncate text-body-sm text-tee-ink-light">
                          {room.lastMessage || '-'}
                        </p>
                        <p className="text-body-xs text-tee-ink-muted">{room.lastMessageTime || '-'}</p>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      {room.unreadCount > 0 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-tee-accent-primary text-body-xs font-semibold text-white">
                          {room.unreadCount}
                        </span>
                      ) : (
                        <span className="text-tee-ink-muted">—</span>
                      )}
                    </td>
                    <td className="table-cell text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                          room.status === 'active'
                            ? 'bg-info-bg text-info'
                            : room.status === 'matched'
                              ? 'bg-success-bg text-success'
                              : 'bg-tee-surface text-tee-ink-light'
                        }`}
                      >
                        {room.status === 'active'
                          ? '활성'
                          : room.status === 'matched'
                            ? '매칭 완료'
                            : '종료'}
                      </span>
                    </td>
                    <td className="table-cell text-center text-body-xs text-tee-ink-muted">
                      {room.createdAt}
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        href={`/admin/chats/${room.id}`}
                        className="rounded-lg border border-tee-accent-primary bg-tee-accent-primary/10 px-4 py-2 text-body-sm font-medium text-tee-accent-primary hover:bg-tee-accent-primary hover:text-white"
                      >
                        보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {chatRooms.length === 0 && (
            <div className="rounded-2xl border border-tee-stone bg-tee-surface/50 p-12 text-center">
              <p className="text-body-lg text-tee-ink-muted">채팅방이 없습니다.</p>
            </div>
          )}
        </section>

        {/* Chat Insights */}
        <section className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-tee-ink-strong">채팅 인사이트</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-tee-surface shadow-card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                평균 응답 시간
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-tee-ink-strong">-</div>
              <p className="text-body-sm text-tee-ink-light">
                프로 평균 첫 응답까지 걸리는 시간
              </p>
              <div className="mt-4 text-body-xs text-tee-ink-muted">데이터 수집 중</div>
            </div>

            <div className="rounded-2xl bg-tee-surface shadow-card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                매칭 성공률
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-tee-ink-strong">
                {stats.totalRooms > 0
                  ? `${((stats.matchedRooms / stats.totalRooms) * 100).toFixed(1)}%`
                  : '-'}
              </div>
              <p className="text-body-sm text-tee-ink-light">
                채팅 시작 후 실제 레슨으로 이어진 비율
              </p>
              <div className="mt-4 text-body-xs text-tee-ink-muted">전체 채팅방 기준</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
