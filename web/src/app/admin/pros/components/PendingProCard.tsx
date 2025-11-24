interface PendingPro {
  id: number
  name: string
  title: string
  location: string
  email: string
  phone: string
  specialties: string[]
  tourExperience: string
  certifications: string[]
  appliedAt: string
  profileImage: string
}

interface PendingProCardProps {
  pro: PendingPro
  onApprove: (id: number) => void
  onReject: (id: number) => void
  isProcessing: boolean
}

export function PendingProCard({ pro, onApprove, onReject, isProcessing }: PendingProCardProps) {
  return (
    <div className="card">
      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* Left: Pro Image & Basic Info */}
        <div>
          <img
            src={pro.profileImage}
            alt={pro.name}
            className="mb-4 h-64 w-full rounded-xl object-cover"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-calm-obsidian">{pro.name}</h3>
            <p className="text-body-sm text-calm-ash">{pro.title}</p>
            <p className="text-body-sm text-calm-charcoal">📍 {pro.location}</p>
            <p className="text-body-xs text-calm-ash">신청: {pro.appliedAt}</p>
          </div>
        </div>

        {/* Right: Detailed Info */}
        <div className="space-y-6 p-6">
          {/* Contact */}
          <div>
            <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
              연락처
            </h4>
            <p className="text-body-sm text-calm-charcoal">📧 {pro.email}</p>
            <p className="text-body-sm text-calm-charcoal">📱 {pro.phone}</p>
          </div>

          {/* Specialties */}
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

          {/* Experience */}
          <div>
            <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
              투어 경력
            </h4>
            <p className="text-body-sm text-calm-charcoal">{pro.tourExperience}</p>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="mb-2 text-body-sm font-semibold uppercase tracking-wide text-calm-ash">
              자격증
            </h4>
            <ul className="space-y-1">
              {pro.certifications.map((cert, index) => (
                <li key={index} className="text-body-sm text-calm-charcoal">
                  ✓ {cert}
                </li>
              ))}
            </ul>
          </div>

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
              onClick={() => onReject(pro.id)}
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
