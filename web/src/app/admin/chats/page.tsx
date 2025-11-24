'use client'

import Link from 'next/link'
import { useFlaggedMessages } from '@/hooks/useFlaggedMessages'
import { FlaggedMessageCard } from './components/FlaggedMessageCard'

const activeChatRooms = [
  {
    id: 1,
    golferName: 'Park Ji-sung',
    golferPhone: '010-9876-5432',
    proName: 'Hannah Park',
    proId: 101,
    lastMessage: '다음 주 화요일 오후 2시 가능할까요?',
    lastMessageTime: '2025-11-24 14:32',
    unreadCount: 2,
    status: 'active',
    createdAt: '2025-11-23 10:15',
  },
  {
    id: 2,
    golferName: 'Kim Min-jae',
    golferPhone: '010-8765-4321',
    proName: 'James Kim',
    proId: 102,
    lastMessage: '감사합니다. 확인했습니다.',
    lastMessageTime: '2025-11-24 13:15',
    unreadCount: 0,
    status: 'matched',
    createdAt: '2025-11-22 15:30',
    matchedAt: '2025-11-23 09:20',
  },
  {
    id: 3,
    golferName: 'Lee Soo-hyun',
    golferPhone: '010-7654-3210',
    proName: 'Sophia Lee',
    proId: 103,
    lastMessage: '안녕하세요, 레슨 문의드립니다.',
    lastMessageTime: '2025-11-24 11:50',
    unreadCount: 1,
    status: 'active',
    createdAt: '2025-11-24 11:45',
  },
  {
    id: 4,
    golferName: 'Choi Yeon-woo',
    golferPhone: '010-6543-2109',
    proName: 'Michael Choi',
    proId: 104,
    lastMessage: '레슨 완료했습니다. 감사합니다!',
    lastMessageTime: '2025-11-23 18:30',
    unreadCount: 0,
    status: 'closed',
    createdAt: '2025-11-20 14:00',
    closedAt: '2025-11-23 18:30',
  },
]

const initialFlaggedMessages = [
  {
    id: 1,
    chatRoomId: 5,
    sender: 'Unknown User',
    content: '다른 플랫폼에서 연락주세요. 카톡 ID: abc123',
    flagReason: 'Off-platform contact attempt',
    flaggedAt: '2025-11-24 12:20',
    status: 'pending',
  },
  {
    id: 2,
    chatRoomId: 6,
    sender: 'Pro Lee',
    content: '돈 먼저 입금하시면 스케줄 잡아드릴게요.',
    flagReason: 'Potential scam - upfront payment request',
    flaggedAt: '2025-11-23 16:45',
    status: 'reviewed',
  },
]

const chatStats = [
  { label: '전체 채팅방', value: '156', change: '+12 this week' },
  { label: '활성 대화', value: '23', change: '14.7% of total' },
  { label: '매칭 완료', value: '89', change: '57.1% conversion' },
  { label: '신고된 메시지', value: '3', change: '1 pending review' },
]

export default function AdminChatsPage() {
  const { flaggedMessages, processingId, handleAction, handleDismiss } = useFlaggedMessages(
    initialFlaggedMessages
  )

  return (
    <div className="min-h-screen bg-calm-white">
      {/* Admin Header */}
      <header className="border-b border-calm-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-calm-obsidian">채팅 관리</h1>
              <p className="text-body-sm text-calm-ash">실시간 대화 모니터링 및 중재</p>
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
              className="border-b-2 border-accent px-4 py-4 text-body-sm font-semibold text-accent"
            >
              채팅 관리
            </Link>
            <Link
              href="/admin/users"
              className="border-b-2 border-transparent px-4 py-4 text-body-sm font-medium text-calm-charcoal hover:text-accent"
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
            {chatStats.map((stat, idx) => (
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

        {/* Flagged Messages Section */}
        {flaggedMessages.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-calm-obsidian">
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
            <h2 className="text-2xl font-semibold text-calm-obsidian">
              채팅방 목록 ({activeChatRooms.length})
            </h2>
            <input
              type="search"
              placeholder="골퍼/프로 이름 검색..."
              className="input w-64"
            />
          </div>

          <div className="table-container">
            <table className="w-full">
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
                {activeChatRooms.map((room) => (
                  <tr key={room.id} className="table-row">
                    <td className="table-cell font-mono font-semibold text-accent">
                      #{room.id}
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-calm-obsidian">{room.golferName}</p>
                        <p className="text-body-xs text-calm-ash">{room.golferPhone}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-calm-obsidian">{room.proName}</p>
                        <p className="text-body-xs text-calm-ash">ID: {room.proId}</p>
                      </div>
                    </td>
                    <td className="table-cell max-w-xs">
                      <div>
                        <p className="truncate text-body-sm text-calm-charcoal">
                          {room.lastMessage}
                        </p>
                        <p className="text-body-xs text-calm-ash">{room.lastMessageTime}</p>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      {room.unreadCount > 0 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-body-xs font-semibold text-white">
                          {room.unreadCount}
                        </span>
                      ) : (
                        <span className="text-calm-ash">—</span>
                      )}
                    </td>
                    <td className="table-cell text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                          room.status === 'active'
                            ? 'bg-info-bg text-info'
                            : room.status === 'matched'
                              ? 'bg-success-bg text-success'
                              : 'bg-calm-cloud text-calm-charcoal'
                        }`}
                      >
                        {room.status === 'active'
                          ? '활성'
                          : room.status === 'matched'
                            ? '매칭 완료'
                            : '종료'}
                      </span>
                    </td>
                    <td className="table-cell text-center text-body-xs text-calm-ash">
                      {room.createdAt}
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        href={`/admin/chats/${room.id}`}
                        className="rounded-lg border border-accent bg-accent/10 px-4 py-2 text-body-sm font-medium text-accent hover:bg-accent hover:text-white"
                      >
                        보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {activeChatRooms.length === 0 && (
            <div className="rounded-2xl border border-calm-stone bg-calm-cloud/50 p-12 text-center">
              <p className="text-body-lg text-calm-ash">채팅방이 없습니다.</p>
            </div>
          )}
        </section>

        {/* Chat Insights */}
        <section className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-calm-obsidian">채팅 인사이트</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
                평균 응답 시간
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-calm-obsidian">2.3시간</div>
              <p className="text-body-sm text-calm-charcoal">
                프로 평균 첫 응답까지 걸리는 시간
              </p>
              <div className="mt-4 text-body-xs text-success">↓ 18% 지난 주 대비 개선</div>
            </div>

            <div className="card p-6">
              <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
                매칭 성공률
              </h4>
              <div className="mb-2 font-display text-3xl font-bold text-calm-obsidian">57.1%</div>
              <p className="text-body-sm text-calm-charcoal">
                채팅 시작 후 실제 레슨으로 이어진 비율
              </p>
              <div className="mt-4 text-body-xs text-success">↑ 5.2% 지난 달 대비 상승</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
