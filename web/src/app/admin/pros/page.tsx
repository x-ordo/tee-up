'use client'

import Link from 'next/link'
import { useProManagement } from '@/hooks/useProManagement'
import { PendingProCard } from './components/PendingProCard'
import { ApprovedProsTable } from './components/ApprovedProsTable'
import type { ProProfile } from '@/lib/api/profiles'

// Mock pending pros data matching ProProfile type
const initialPendingPros: ProProfile[] = [
  {
    id: 'pending-1',
    user_id: 'user-1',
    slug: 'kim-soo-jin',
    title: 'KLPGA Professional',
    bio: 'KLPGA Tour 6 years experience',
    specialties: ['Putting', 'Short Game', 'Mental Coaching'],
    hero_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    profile_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    profile_views: 0,
    monthly_chat_count: 0,
    total_leads: 0,
    matched_lessons: 0,
    rating: 0,
    subscription_tier: 'basic',
    subscription_expires_at: null,
    is_approved: false,
    is_featured: false,
    created_at: '2025-11-23T14:30:00Z',
    updated_at: '2025-11-23T14:30:00Z',
    profiles: {
      full_name: 'Kim Soo-jin',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      phone: '010-1234-5678',
    },
  },
  {
    id: 'pending-2',
    user_id: 'user-2',
    slug: 'lee-dong-hyun',
    title: 'PGA Master Professional',
    bio: 'PGA Tour Coach 10+ years',
    specialties: ['Driver Distance', 'TrackMan Analysis', 'Biomechanics'],
    hero_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    profile_views: 0,
    monthly_chat_count: 0,
    total_leads: 0,
    matched_lessons: 0,
    rating: 0,
    subscription_tier: 'basic',
    subscription_expires_at: null,
    is_approved: false,
    is_featured: false,
    created_at: '2025-11-23T11:20:00Z',
    updated_at: '2025-11-23T11:20:00Z',
    profiles: {
      full_name: 'Lee Dong-hyun',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      phone: '010-2345-6789',
    },
  },
]

// Mock approved pros data
const initialApprovedPros: ProProfile[] = [
  {
    id: 'approved-1',
    user_id: 'user-101',
    slug: 'hannah-park',
    title: 'LPGA Tour Professional',
    bio: 'LPGA Tour experience',
    specialties: ['Driver', 'Iron Play'],
    hero_image_url: null,
    profile_image_url: null,
    profile_views: 247,
    monthly_chat_count: 5,
    total_leads: 5,
    matched_lessons: 3,
    rating: 4.9,
    subscription_tier: 'basic',
    subscription_expires_at: null,
    is_approved: true,
    is_featured: false,
    approved_at: '2025-11-20T10:00:00Z',
    created_at: '2025-11-20T10:00:00Z',
    updated_at: '2025-11-20T10:00:00Z',
    profiles: {
      full_name: 'Hannah Park',
      avatar_url: null,
      phone: null,
    },
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
