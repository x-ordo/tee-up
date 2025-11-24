import Link from 'next/link'

interface ApprovedPro {
  id: number
  name: string
  title: string
  location: string
  status: 'active'
  profileViews: number
  leads: number
  matchedLessons: number
  rating: number
  subscriptionTier: 'basic' | 'pro'
}

interface ApprovedProsTableProps {
  pros: ApprovedPro[]
}

export function ApprovedProsTable({ pros }: ApprovedProsTableProps) {
  // Filter out placeholder pros (those without names)
  const visiblePros = pros.filter(pro => pro.name)

  return (
    <div className="table-container">
      <table className="w-full">
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
          {visiblePros.map((pro) => (
            <tr key={pro.id} className="table-row">
              <td className="table-cell font-semibold text-calm-obsidian">{pro.name}</td>
              <td className="table-cell">{pro.title}</td>
              <td className="table-cell">{pro.location}</td>
              <td className="table-cell text-center font-mono">{pro.profileViews}</td>
              <td className="table-cell text-center font-mono">{pro.leads}</td>
              <td className="table-cell text-center font-mono">{pro.matchedLessons}</td>
              <td className="table-cell text-center font-mono">{pro.rating}</td>
              <td className="table-cell text-center">
                <span
                  className={`rounded-full px-3 py-1 text-body-xs font-medium ${
                    pro.subscriptionTier === 'pro'
                      ? 'bg-success-bg text-success'
                      : 'bg-calm-cloud text-calm-charcoal'
                  }`}
                >
                  {pro.subscriptionTier === 'pro' ? 'Pro' : 'Basic'}
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
