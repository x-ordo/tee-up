import { getMyLeads, getLeadStats } from '@/actions/leads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getContactMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    kakao: '카카오톡',
    phone: '전화',
    email: '이메일',
    form: '문의폼',
  };
  return labels[method] || method;
}

export default async function LeadsPage() {
  const [leadsResult, statsResult] = await Promise.all([
    getMyLeads({ limit: 50 }),
    getLeadStats(),
  ]);

  const leads = leadsResult.success ? leadsResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-tee-ink-strong">리드 관리</h1>
        <p className="mt-2 text-tee-ink-light">
          포트폴리오를 통해 들어온 문의를 확인하세요
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
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
          {leads.length > 0 ? (
            <div className="divide-y divide-tee-ink-light/10">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tee-accent-primary/10 text-tee-accent-primary">
                      {lead.contact_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-tee-ink-strong">
                        {lead.contact_name || '익명'}
                      </p>
                      <p className="text-sm text-tee-ink-light">
                        {getContactMethodLabel(lead.contact_method)} 문의
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-tee-ink-light">
                      {formatDate(lead.created_at)}
                    </p>
                    {lead.source_url && (
                      <p className="text-xs text-tee-ink-light/70 truncate max-w-[200px]">
                        {lead.source_url}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-tee-ink-light">아직 리드가 없습니다.</p>
              <p className="mt-2 text-sm text-tee-ink-light/70">
                포트폴리오를 공유하여 첫 번째 리드를 받아보세요!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
