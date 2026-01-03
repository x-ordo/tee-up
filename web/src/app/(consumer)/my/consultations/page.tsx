import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, ChevronRight, Clock, CheckCircle, XCircle, Phone } from 'lucide-react';
import { getConsumerConsultations } from '@/actions/consumer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function ConsultationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-tee-stone/30" />
      ))}
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-tee-warning/10 px-3 py-1 text-xs font-medium text-tee-warning">
          <Clock className="h-3 w-3" />
          대기 중
        </span>
      );
    case 'contacted':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-tee-info/10 px-3 py-1 text-xs font-medium text-tee-info">
          <Phone className="h-3 w-3" />
          연락 완료
        </span>
      );
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-tee-accent-primary/10 px-3 py-1 text-xs font-medium text-tee-accent-primary">
          <CheckCircle className="h-3 w-3" />
          일정 확정
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-tee-success/10 px-3 py-1 text-xs font-medium text-tee-success">
          <CheckCircle className="h-3 w-3" />
          완료
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-tee-error/10 px-3 py-1 text-xs font-medium text-tee-error">
          <XCircle className="h-3 w-3" />
          취소됨
        </span>
      );
    default:
      return null;
  }
}

async function ConsultationsList() {
  const result = await getConsumerConsultations();

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-tee-ink-muted">상담 내역을 불러오는데 실패했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const consultations = result.data;

  if (consultations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tee-stone/30">
            <MessageSquare className="h-8 w-8 text-tee-ink-muted" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-tee-ink-strong">
              상담 신청 내역이 없습니다
            </h3>
            <p className="text-sm text-tee-ink-muted">
              프로에게 상담을 신청하고 레슨을 시작해보세요
            </p>
          </div>
          <Button asChild variant="primary" className="mt-2">
            <Link href="/explore">프로 찾아보기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Group by status
  const pending = consultations.filter((c) => c.status === 'pending' || c.status === 'contacted');
  const scheduled = consultations.filter((c) => c.status === 'scheduled');
  const completed = consultations.filter((c) => c.status === 'completed' || c.status === 'cancelled');

  return (
    <div className="space-y-8">
      {/* Pending/Active Consultations */}
      {pending.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-tee-ink-strong">진행 중</h3>
          <div className="space-y-3">
            {pending.map((consultation) => (
              <Card key={consultation.id} className="overflow-hidden">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Pro Avatar */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    {consultation.pro?.profile_image_url ? (
                      <Image
                        src={consultation.pro.profile_image_url}
                        alt={consultation.pro.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-tee-accent-primary/10">
                        <span className="text-sm font-bold text-tee-accent-primary">
                          {consultation.pro?.title?.charAt(0) || 'P'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${consultation.pro?.slug}`}
                      className="font-semibold text-tee-ink-strong hover:text-tee-accent-primary"
                    >
                      {consultation.pro?.title || '프로'}
                    </Link>
                    <p className="text-sm text-tee-ink-muted">
                      {format(new Date(consultation.created_at), 'M월 d일 신청', { locale: ko })}
                    </p>
                  </div>

                  {/* Status */}
                  {getStatusBadge(consultation.status)}

                  {/* Action */}
                  <Link
                    href={`/${consultation.pro?.slug}`}
                    className="hidden sm:flex items-center text-tee-ink-muted hover:text-tee-accent-primary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-tee-ink-strong">일정 확정</h3>
          <div className="space-y-3">
            {scheduled.map((consultation) => (
              <Card key={consultation.id} className="overflow-hidden border-tee-accent-primary/30">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    {consultation.pro?.profile_image_url ? (
                      <Image
                        src={consultation.pro.profile_image_url}
                        alt={consultation.pro.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-tee-accent-primary/10">
                        <span className="text-sm font-bold text-tee-accent-primary">
                          {consultation.pro?.title?.charAt(0) || 'P'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${consultation.pro?.slug}`}
                      className="font-semibold text-tee-ink-strong hover:text-tee-accent-primary"
                    >
                      {consultation.pro?.title || '프로'}
                    </Link>
                    <p className="text-sm text-tee-ink-muted">
                      {format(new Date(consultation.created_at), 'M월 d일 신청', { locale: ko })}
                    </p>
                  </div>

                  {getStatusBadge(consultation.status)}

                  <Link
                    href={`/${consultation.pro?.slug}`}
                    className="hidden sm:flex items-center text-tee-ink-muted hover:text-tee-accent-primary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed/Cancelled */}
      {completed.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-tee-ink-strong">지난 상담</h3>
          <div className="space-y-3">
            {completed.slice(0, 5).map((consultation) => (
              <Card key={consultation.id} className="bg-tee-stone/10">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    {consultation.pro?.profile_image_url ? (
                      <Image
                        src={consultation.pro.profile_image_url}
                        alt={consultation.pro.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-tee-accent-primary/10">
                        <span className="text-xs font-bold text-tee-accent-primary">
                          {consultation.pro?.title?.charAt(0) || 'P'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-tee-ink-strong">
                      {consultation.pro?.title || '프로'}
                    </p>
                    <p className="text-sm text-tee-ink-muted">
                      {format(new Date(consultation.created_at), 'yyyy.MM.dd', { locale: ko })}
                    </p>
                  </div>

                  {getStatusBadge(consultation.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsultationsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-tee-ink-strong">상담 현황</h1>
        <p className="mt-1 text-sm text-tee-ink-muted">
          프로에게 신청한 상담 내역을 확인하세요
        </p>
      </div>

      {/* Consultations List */}
      <Suspense fallback={<ConsultationSkeleton />}>
        <ConsultationsList />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: '상담 현황 - TEE:UP',
  description: '상담 신청 내역을 확인하세요',
};
