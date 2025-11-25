import type { ProProfile } from '@/lib/api/profiles'

interface PendingProCardProps {
  pro: ProProfile
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  isProcessing: boolean
}

export function PendingProCard({ pro, onApprove, onReject, isProcessing }: PendingProCardProps) {
  const handleRejectClick = () => {
    const reason = window.prompt('거절 사유를 입력하세요:')
    if (reason) {
      onReject(pro.id, reason)
    }
  }

  return (
    <div className="card">
      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* Left: Pro Image & Basic Info */}
        <div>
          <img
            src={pro.profile_image_url || 'https://via.placeholder.com/400'}
            alt={pro.profiles?.full_name || 'Pro'}
            className="mb-4 h-64 w-full rounded-xl object-cover"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-calm-obsidian">
              {pro.profiles?.full_name || 'Unknown'}
            </h3>
            <p className="text-body-sm text-calm-ash">{pro.title}</p>
            <p className="text-body-xs text-calm-ash">
              신청: {new Date(pro.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>

        {/* Right: Detailed Info */}
        <div className="space-y-6 p-6">
          {/* Contact */}
          {pro.profiles?.phone && (
            <div>
              <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
                연락처
              </h4>
              <p className="text-body-sm text-calm-charcoal">📱 {pro.profiles.phone}</p>
            </div>
          )}

          {/* Specialties */}
          {pro.specialties && pro.specialties.length > 0 && (
            <div>
              <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
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

          {/* Bio */}
          {pro.bio && (
            <div>
              <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
                소개
              </h4>
              <p className="text-body-sm text-calm-charcoal">{pro.bio}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-calm-stone pt-6">
            <button
              className="btn-primary flex-1"
              onClick={() => onApprove(pro.id)}
              disabled={isProcessing}
            >
              승인
            </button>
            <button
              className="btn-ghost flex-1"
              onClick={handleRejectClick}
              disabled={isProcessing}
            >
              거부
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
