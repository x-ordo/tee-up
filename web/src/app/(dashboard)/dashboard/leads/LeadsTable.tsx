'use client';

import { ResponsiveTable } from '@/components/patterns/ResponsiveTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

type Lead = {
  id: string;
  contact_name: string | null;
  contact_method: string;
  created_at: string;
  source_url: string | null;
  [key: string]: unknown;
};

interface LeadsTableProps {
  leads: Lead[];
}

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

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <ResponsiveTable<Lead>
      data={leads}
      keyField="id"
      columns={[
        {
          key: 'contact_name',
          header: '이름',
          render: (item) => (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tee-accent-primary/10 text-tee-accent-primary">
                {item.contact_name?.charAt(0) || '?'}
              </div>
              <span className="font-medium">{item.contact_name || '익명'}</span>
            </div>
          ),
        },
        {
          key: 'contact_method',
          header: '연락 방법',
          render: (item) => getContactMethodLabel(item.contact_method),
          hideOnMobile: true,
        },
        {
          key: 'created_at',
          header: '문의 일시',
          align: 'right',
          render: (item) => formatDate(item.created_at),
        },
      ]}
      mobileCard={(item) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tee-accent-primary/10 text-tee-accent-primary">
              {item.contact_name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="font-medium text-tee-ink-strong">
                {item.contact_name || '익명'}
              </p>
              <p className="text-sm text-tee-ink-light">
                {getContactMethodLabel(item.contact_method)} 문의
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-tee-ink-light">
              {formatDate(item.created_at)}
            </p>
          </div>
        </div>
      )}
      emptyState={
        <EmptyState
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
          title="아직 리드가 없습니다"
          description="포트폴리오를 공유하여 첫 번째 리드를 받아보세요!"
          action={
            <Button asChild>
              <a href="/dashboard/portfolio">포트폴리오 공유하기</a>
            </Button>
          }
        />
      }
    />
  );
}
