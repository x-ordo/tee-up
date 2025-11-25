import Link from 'next/link'
import type { ProProfile } from '@/lib/api/profiles'

interface ApprovedProsTableProps {
  pros: ProProfile[]
}

export function ApprovedProsTable({ pros }: ApprovedProsTableProps) {
  // Filter out placeholder pros (those without names)
  const visiblePros = pros.filter(pro => pro.profiles?.full_name)

  return (
    <div className="table-container">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th className="text-left">이름</th>
            <th className="text-left">직함</th>
            <th className="text-center">조회수</th>
            <th className="text-center">Leads</th>
            <th className="text-center">매칭</th>
            <th className="text-center">평점</th>
            <th className="text-center">구독</th>
            <th className="text-right">작업</th>
          </tr>
        </thead>
        <tbody>
          {visiblePros.map((pro) => (
            <tr key={pro.id} className="table-row">
              <td className="table-cell">
                <div className="font-medium text-calm-obsidian">{pro.profiles?.full_name}</div>
              </td>
              <td className="table-cell text-calm-charcoal">{pro.title}</td>
              <td className="table-cell text-center font-medium text-calm-obsidian">{pro.profile_views}</td>
              <td className="table-cell text-center font-medium text-calm-obsidian">{pro.total_leads}</td>
              <td className="table-cell text-center font-medium text-calm-obsidian">{pro.matched_lessons}</td>
              <td className="table-cell text-center">
                <span className="font-medium text-success">{pro.rating.toFixed(1)}</span>
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
  )
}
