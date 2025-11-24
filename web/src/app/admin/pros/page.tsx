'use client'

import Link from 'next/link'
import { useProManagement } from '@/hooks/useProManagement'
import { PendingProCard } from './components/PendingProCard'
import { ApprovedProsTable } from './components/ApprovedProsTable'

const initialPendingPros = [
  {
    id: 1,
    name: 'Kim Soo-jin',
    title: 'KLPGA Professional',
    location: 'Seoul',
    email: 'soojin.kim@email.com',
    phone: '010-1234-5678',
    specialties: ['Putting', 'Short Game', 'Mental Coaching'],
    tourExperience: 'KLPGA Tour 6 years',
    certifications: ['KLPGA Professional License', 'Sports Psychology Certificate'],
    appliedAt: '2025-11-23 14:30',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: 2,
    name: 'Lee Dong-hyun',
    title: 'PGA Master Professional',
    location: 'Busan',
    email: 'donghyun.lee@email.com',
    phone: '010-2345-6789',
    specialties: ['Driver Distance', 'TrackMan Analysis', 'Biomechanics'],
    tourExperience: 'PGA Tour Coach 10+ years',
    certifications: ['PGA Master Professional Certificate', 'TrackMan University Master'],
    appliedAt: '2025-11-23 11:20',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: 3,
    name: 'Park Min-ji',
    title: 'Short Game Specialist',
    location: 'Gangnam',
    email: 'minji.park@email.com',
    phone: '010-3456-7890',
    specialties: ['Chipping', 'Bunker Play', 'Scoring Zone'],
    tourExperience: 'KLPGA Tour 3 years, Teaching 5 years',
    certifications: ['KLPGA Teaching Professional', 'Dave Pelz Short Game School'],
    appliedAt: '2025-11-22 16:45',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  },
]

const initialApprovedPros = [
  {
    id: 101,
    name: 'Hannah Park',
    title: 'LPGA Tour Professional',
    location: 'Seoul',
    status: 'active' as const,
    profileViews: 247,
    leads: 5,
    matchedLessons: 3,
    rating: 4.9,
    subscriptionTier: 'basic' as const,
  },
  {
    id: 102,
    name: 'James Kim',
    title: 'PGA Teaching Professional',
    location: 'Seoul',
    status: 'active' as const,
    profileViews: 189,
    leads: 8,
    matchedLessons: 6,
    rating: 4.8,
    subscriptionTier: 'pro' as const,
  },
  {
    id: 103,
    name: 'Sophia Lee',
    title: 'KLPGA Teaching Professional',
    location: 'Gangnam',
    status: 'active' as const,
    profileViews: 156,
    leads: 2,
    matchedLessons: 1,
    rating: 4.7,
    subscriptionTier: 'basic' as const,
  },
]

export default function AdminProsPage() {
  const { pendingPros, approvedPros, processingId, handleApprove, handleReject } = useProManagement(
    initialPendingPros,
    initialApprovedPros
  )

  return (
    <div className="min-h-screen bg-calm-white">
      {/* Admin Header */}
      <header className="border-b border-calm-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-calm-obsidian">프로 관리</h1>
              <p className="text-body-sm text-calm-ash">프로 신청 검토 및 승인된 프로 관리</p>
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
              className="border-b-2 border-accent px-4 py-4 text-body-sm font-semibold text-accent"
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
        {/* Pending Applications Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-calm-obsidian">승인 대기 중 ({pendingPros.length})</h2>
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
            <div className="rounded-2xl border border-calm-stone bg-calm-cloud/50 p-12 text-center">
              <p className="text-body-lg text-calm-ash">대기 중인 신청이 없습니다.</p>
            </div>
          )}
        </section>

        {/* Approved Pros Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-calm-obsidian">승인된 프로 ({approvedPros.length})</h2>
            <input
              type="search"
              placeholder="프로 검색..."
              className="input w-64"
            />
          </div>

          <ApprovedProsTable pros={approvedPros} />

          {approvedPros.length === 0 && (
            <div className="rounded-2xl border border-calm-stone bg-calm-cloud/50 p-12 text-center">
              <p className="text-body-lg text-calm-ash">승인된 프로가 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
