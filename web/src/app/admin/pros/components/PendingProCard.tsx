import Image from 'next/image'
import { type PendingProProfile } from '@/lib/api/profiles'

interface PendingProCardProps {
  pro: PendingProProfile
  onApprove: (id: string) => void
  onReject: (id: string) => void
  isProcessing: boolean
}

export function PendingProCard({ pro, onApprove, onReject, isProcessing }: PendingProCardProps) {
  const profileName = pro.profiles?.full_name || '이름 미입력'
  const profileImage = pro.profile_image_url || pro.hero_image_url || '/placeholder-profile.jpg'
  const phone = pro.profiles?.phone || '연락처 미입력'

  return (
    <div className="rounded-2xl bg-tee-surface shadow-card" data-testid="pending-pro-card">
      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* Left: Pro Image & Basic Info */}
        <div>
          <div className="relative mb-4 h-64 w-full overflow-hidden rounded-xl">
            <Image
              src={profileImage}
              alt={profileName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-tee-ink-strong">{profileName}</h3>
            <p className="text-body-sm text-tee-ink-muted">{pro.title}</p>
            {pro.location && (
              <p className="text-body-sm text-tee-ink-light">📍 {pro.location}</p>
            )}
            <p className="text-body-xs text-tee-ink-muted">
              신청: {new Date(pro.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>

        {/* Right: Detailed Info */}
        <div className="space-y-6 p-6">
          {/* Contact */}
          <div>
            <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
              연락처
            </h4>
            <p className="text-body-sm text-tee-ink-light">📱 {phone}</p>
          </div>

          {/* Specialties */}
          {pro.specialties && pro.specialties.length > 0 && (
            <div>
              <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                전문 분야
              </h4>
              <div className="flex flex-wrap gap-2">
                {pro.specialties.map((specialty) => (
                  <span key={specialty} className="tag">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {pro.tour_experience && (
            <div>
              <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                투어 경력
              </h4>
              <p className="text-body-sm text-tee-ink-light">{pro.tour_experience}</p>
            </div>
          )}

          {/* Certifications */}
          {pro.certifications && pro.certifications.length > 0 && (
            <div>
              <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                자격증
              </h4>
              <ul className="space-y-1">
                {pro.certifications.map((cert, index) => (
                  <li key={index} className="text-body-sm text-tee-ink-light">
                    ✓ {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bio */}
          {pro.bio && (
            <div>
              <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-tee-ink-muted">
                소개
              </h4>
              <p className="text-body-sm text-tee-ink-light line-clamp-3">{pro.bio}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-tee-stone pt-6">
            <button
              className="h-12 rounded-xl bg-tee-accent-primary px-6 py-3 font-medium text-white transition-colors hover:bg-tee-accent-primary-hover flex-1"
              onClick={() => onApprove(pro.id)}
              disabled={isProcessing}
              aria-busy={isProcessing}
              aria-label={`${profileName} 프로 승인`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  처리 중입니다
                </span>
              ) : (
                '승인'
              )}
            </button>
            <button
              className="h-12 rounded-xl border border-tee-stone bg-tee-surface px-6 py-3 font-medium text-tee-ink-strong transition-colors hover:bg-tee-background flex-1"
              onClick={() => onReject(pro.id)}
              disabled={isProcessing}
              aria-label={`${profileName} 프로 거부`}
            >
              반려
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
