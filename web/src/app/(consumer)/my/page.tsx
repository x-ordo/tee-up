import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, isPast, isFuture, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, Clock, MapPin, ChevronRight, CalendarCheck, CalendarX } from 'lucide-react';
import { getConsumerBookings, getConsumerStats } from '@/actions/consumer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function BookingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 rounded-2xl bg-tee-stone/30" />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? 'border-tee-accent-primary/30 bg-tee-accent-primary/5' : ''}>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            accent ? 'bg-tee-accent-primary/10' : 'bg-tee-stone/30'
          }`}
        >
          <Icon className={`h-6 w-6 ${accent ? 'text-tee-accent-primary' : 'text-tee-ink-muted'}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-tee-ink-strong">{value}</p>
          <p className="text-sm text-tee-ink-muted">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusBadge(status: string, startAt: string) {
  const isUpcoming = isFuture(new Date(startAt));
  const isNow = isToday(new Date(startAt));

  if (status === 'cancelled') {
    return (
      <span className="inline-flex items-center rounded-full bg-tee-error/10 px-3 py-1 text-xs font-medium text-tee-error">
        취소됨
      </span>
    );
  }

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center rounded-full bg-tee-success/10 px-3 py-1 text-xs font-medium text-tee-success">
        완료
      </span>
    );
  }

  if (isNow) {
    return (
      <span className="inline-flex items-center rounded-full bg-tee-accent-secondary/10 px-3 py-1 text-xs font-medium text-tee-accent-secondary">
        오늘
      </span>
    );
  }

  if (isUpcoming) {
    return (
      <span className="inline-flex items-center rounded-full bg-tee-accent-primary/10 px-3 py-1 text-xs font-medium text-tee-accent-primary">
        {status === 'confirmed' ? '예약 확정' : '대기 중'}
      </span>
    );
  }

  return null;
}

async function BookingsList() {
  const result = await getConsumerBookings();

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-tee-ink-muted">예약 정보를 불러오는데 실패했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const bookings = result.data;

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tee-stone/30">
            <Calendar className="h-8 w-8 text-tee-ink-muted" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-tee-ink-strong">예약 내역이 없습니다</h3>
            <p className="text-sm text-tee-ink-muted">
              원하는 프로를 찾아 첫 레슨을 예약해보세요
            </p>
          </div>
          <Button asChild variant="primary" className="mt-2">
            <Link href="/explore">프로 찾아보기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Split into upcoming and past
  const upcomingBookings = bookings.filter(
    (b) => isFuture(new Date(b.start_at)) && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => isPast(new Date(b.start_at)) || b.status === 'cancelled'
  );

  return (
    <div className="space-y-8">
      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-tee-ink-strong">다가오는 예약</h3>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Pro Image */}
                    <div className="relative hidden w-24 shrink-0 sm:block">
                      {booking.pro?.profile_image_url ? (
                        <Image
                          src={booking.pro.profile_image_url}
                          alt={booking.pro.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-tee-accent-primary/10">
                          <span className="text-2xl font-bold text-tee-accent-primary">
                            {booking.pro?.title?.charAt(0) || 'P'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Booking Info */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/${booking.pro?.slug}`}
                            className="font-semibold text-tee-ink-strong hover:text-tee-accent-primary"
                          >
                            {booking.pro?.title || '프로'}
                          </Link>
                          {booking.pro?.location && (
                            <p className="mt-1 flex items-center gap-1 text-sm text-tee-ink-muted">
                              <MapPin className="h-3.5 w-3.5" />
                              {booking.pro.location}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(booking.status, booking.start_at)}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-tee-ink-light">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(booking.start_at), 'M월 d일 (EEE)', { locale: ko })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {format(new Date(booking.start_at), 'HH:mm')} -{' '}
                          {format(new Date(booking.end_at), 'HH:mm')}
                        </span>
                        {booking.price_amount && (
                          <span className="font-medium text-tee-ink-strong">
                            ₩{booking.price_amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <Link
                      href={`/${booking.pro?.slug}`}
                      className="hidden items-center border-l border-tee-stone/40 px-4 text-tee-ink-muted transition-colors hover:bg-tee-stone/20 hover:text-tee-accent-primary sm:flex"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-tee-ink-strong">지난 예약</h3>
          <div className="space-y-3">
            {pastBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="bg-tee-stone/10">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      {booking.pro?.profile_image_url ? (
                        <Image
                          src={booking.pro.profile_image_url}
                          alt={booking.pro.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-tee-accent-primary/10">
                          <span className="text-sm font-bold text-tee-accent-primary">
                            {booking.pro?.title?.charAt(0) || 'P'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-tee-ink-strong">{booking.pro?.title || '프로'}</p>
                      <p className="text-sm text-tee-ink-muted">
                        {format(new Date(booking.start_at), 'yyyy.MM.dd HH:mm', { locale: ko })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(booking.status, booking.start_at)}
                </CardContent>
              </Card>
            ))}

            {pastBookings.length > 5 && (
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/my/history">
                  모든 예약 보기 ({pastBookings.length}건)
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

async function StatsSection() {
  const result = await getConsumerStats();

  if (!result.success) {
    return null;
  }

  const { upcomingBookings, completedBookings, totalBookings } = result.data;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="다가오는 예약"
        value={upcomingBookings}
        icon={CalendarCheck}
        accent={upcomingBookings > 0}
      />
      <StatCard label="완료한 레슨" value={completedBookings} icon={Calendar} />
      <StatCard label="전체 예약" value={totalBookings} icon={CalendarX} />
    </div>
  );
}

export default function MyPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-tee-ink-strong">내 예약</h1>
        <p className="mt-1 text-sm text-tee-ink-muted">
          예약한 레슨을 확인하고 관리하세요
        </p>
      </div>

      {/* Stats */}
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-tee-stone/30" />
            ))}
          </div>
        }
      >
        <StatsSection />
      </Suspense>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="primary">
          <Link href="/explore">새 레슨 예약</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/quiz">프로 매칭받기</Link>
        </Button>
      </div>

      {/* Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>예약 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<BookingSkeleton />}>
            <BookingsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export const metadata = {
  title: '내 예약 - TEE:UP',
  description: '예약한 레슨을 확인하고 관리하세요',
};
