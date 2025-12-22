import { getMyLeads, getLeadStats } from '@/actions/leads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LeadsTable } from './LeadsTable';

export default async function LeadsPage() {
  const [leadsResult, statsResult] = await Promise.all([
    getMyLeads({ limit: 50 }),
    getLeadStats(),
  ]);

  const leads = leadsResult.success ? leadsResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="space-y-space-6">
      <div>
        <h1 className="text-h2 font-pretendard text-tee-ink-strong">리드 관리</h1>
        <p className="mt-space-2 text-body text-tee-ink-light">
          포트폴리오를 통해 들어온 문의를 확인하세요
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-space-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-tee-ink-light">이번 달</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-tee-ink-strong">
                {stats.monthly_leads}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-tee-ink-light">전체</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-tee-ink-strong">
                {stats.total_leads}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-tee-ink-light">
                무료 리드 잔여
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-tee-accent-primary">
                {stats.is_premium ? '무제한' : `${stats.free_leads_remaining}개`}
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>최근 리드</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsTable leads={leads} />
        </CardContent>
      </Card>
    </div>
  );
}
