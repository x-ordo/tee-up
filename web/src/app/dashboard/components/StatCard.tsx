'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = '지난 달 대비',
  icon,
  accentColor = '#d4af37',
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-xl">
      {/* Background Glow */}
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl"
        style={{ backgroundColor: `${accentColor}20` }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">{title}</span>
          {icon && (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <span style={{ color: accentColor }}>{icon}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <span className="text-4xl font-bold text-white">{value}</span>
        </div>

        {/* Change Indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center text-sm font-medium ${
                isPositive
                  ? 'text-green-400'
                  : isNegative
                  ? 'text-red-400'
                  : 'text-white/40'
              }`}
            >
              {isPositive && (
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              )}
              {isNegative && (
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              )}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-white/40">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 리드 잔여 카드
interface LeadQuotaCardProps {
  remaining: number;
  limit: number;
  onUpgrade: () => void;
}

export function LeadQuotaCard({ remaining, limit, onUpgrade }: LeadQuotaCardProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 100 : Math.round((remaining / limit) * 100);
  const isLow = !isUnlimited && remaining <= 1;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border p-6
        ${
          isLow
            ? 'border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent'
            : 'border-white/10 bg-gradient-to-br from-white/5 to-transparent'
        }
      `}
    >
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">이번 달 리드 현황</span>
          {isUnlimited ? (
            <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-medium text-[#d4af37]">
              PRO 무제한
            </span>
          ) : (
            <span className="text-sm text-white/40">
              {remaining} / {limit}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {!isUnlimited && (
          <div className="mb-4">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLow ? 'bg-red-500' : 'bg-[#d4af37]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Message */}
        {isUnlimited ? (
          <p className="text-sm text-white/60">
            무제한 리드를 즐기세요! 걱정 없이 모든 문의를 받을 수 있습니다.
          </p>
        ) : isLow ? (
          <div className="space-y-3">
            <p className="text-sm text-red-400">
              리드 한도가 거의 소진되었습니다. PRO로 업그레이드하여 무제한으로 이용하세요!
            </p>
            <button
              onClick={onUpgrade}
              className="w-full rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] py-2 text-sm font-semibold text-[#0a0e27] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              PRO로 업그레이드
            </button>
          </div>
        ) : (
          <p className="text-sm text-white/60">
            이번 달 {remaining}개의 무료 리드가 남아있습니다.
          </p>
        )}
      </div>
    </div>
  );
}
