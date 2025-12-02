import Link from 'next/link'
import { type ApprovedProProfile } from '@/lib/api/profiles'

interface ApprovedProsTableProps {
  pros: ApprovedProProfile[]
}

export function ApprovedProsTable({ pros }: ApprovedProsTableProps) {
  return (
    <div className="table-container relative">
      {/* Scroll hint for mobile */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden" aria-hidden="true" />
      <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full">
        <thead>
          <tr className="table-header">
            <th className="text-left">이름</th>
            <th className="text-left">직함</th>
            <th className="text-left">지역</th>
            <th className="text-center">조회수</th>
            <th className="text-center">Leads</th>
            <th className="text-center">매칭</th>
            <th className="text-center">평점</th>
            <th className="text-center">구독</th>
            <th className="text-right">작업</th>
          </tr>
        </thead>
        <tbody>
          {pros.map((pro) => (
            <tr key={pro.id} className="table-row">
              <td className="table-cell font-semibold text-calm-obsidian">
                {pro.profiles?.full_name || '이름 없음'}
              </td>
              <td className="table-cell">{pro.title}</td>
              <td className="table-cell">{pro.location || '-'}</td>
              <td className="table-cell text-center font-mono">{pro.profile_views}</td>
              <td className="table-cell text-center font-mono">{pro.total_leads}</td>
              <td className="table-cell text-center font-mono">{pro.matched_lessons}</td>
              <td className="table-cell text-center font-mono">
                {pro.rating > 0 ? pro.rating.toFixed(1) : '-'}
              </td>
              <td className="table-cell text-center">
                <span
                  className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                    pro.subscription_tier === 'pro'
                      ? 'bg-success-bg text-success'
                      : 'bg-calm-cloud text-calm-charcoal'
                  }`}
                >
                  {pro.subscription_tier === 'pro' ? 'Pro' : 'Basic'}
                </span>
              </td>
              <td className="table-cell text-right">
                <Link
                  href={`/admin/pros/${pro.id}`}
                  className="rounded-lg border border-accent bg-accent/10 px-4 py-2 text-body-sm font-medium text-accent hover:bg-accent hover:text-white"
                >
                  관리
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
