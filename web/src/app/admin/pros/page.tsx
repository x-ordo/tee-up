'use client'

import Link from 'next/link'
import { useProManagement } from '@/hooks/useProManagement'
import { PendingProCard } from './components/PendingProCard'
import { ApprovedProsTable } from './components/ApprovedProsTable'

export default function AdminProsPage() {
  const {
    pendingPros,
    approvedPros,
    processingId,
    isLoading,
    error,
    handleApprove,
    handleReject,
  } = useProManagement()

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Admin Header */}
      <header className="border-b border-tee-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-tee-ink-strong">프로 관리</h1>
              <p className="text-body-sm text-tee-ink-muted">신청을 검토하고 승인된 프로를 한눈에 관리하세요.</p>
            </div>
            <Link href="/admin" className="btn-ghost">
              ← 대시보드로
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
              className="border-b-2 border-tee-accent-primary px-4 py-4 text-body-sm font-semibold text-tee-accent-primary"
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
        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-tee-error bg-tee-error/10 p-4 text-tee-error">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent"></div>
            <span className="ml-3 text-tee-ink-muted">데이터를 불러오고 있어요...</span>
          </div>
        ) : (
          <>
            {/* Pending Applications Section */}
            <section className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-tee-ink-strong">
                  승인 대기 중 ({pendingPros.length})
                </h2>
              </div>

              <div className="space-y-6">
                {pendingPros.map((pro) => (
                  <PendingProCard
                    key={pro.id}
                    pro={pro}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isProcessing={processingId === pro.id}
                  />
                ))}
              </div>

              {pendingPros.length === 0 && (
                <div className="rounded-2xl border border-tee-stone bg-tee-surface/50 p-12 text-center">
                  <p className="text-body-lg text-tee-ink-muted">대기 중인 신청이 없습니다.</p>
                </div>
              )}
            </section>

            {/* Approved Pros Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-tee-ink-strong">
                  승인된 프로 ({approvedPros.length})
                </h2>
                <input
                  type="search"
                  placeholder="프로 검색..."
                  className="input w-64"
                />
              </div>

              <ApprovedProsTable pros={approvedPros} />

              {approvedPros.length === 0 && (
                <div className="rounded-2xl border border-tee-stone bg-tee-surface/50 p-12 text-center">
                  <p className="text-body-lg text-tee-ink-muted">승인된 프로가 없습니다.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
