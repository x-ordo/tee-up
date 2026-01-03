import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookOpen, ChevronRight, MapPin, Clock, DollarSign } from 'lucide-react';
import { getCompletedLessons } from '@/actions/consumer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function LessonsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-tee-stone/30" />
      ))}
    </div>
  );
}

async function LessonsList() {
  const result = await getCompletedLessons();

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-tee-ink-muted">레슨 이력을 불러오는데 실패했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const lessons = result.data;

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tee-stone/30">
            <BookOpen className="h-8 w-8 text-tee-ink-muted" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-tee-ink-strong">
              완료된 레슨이 없습니다
            </h3>
            <p className="text-sm text-tee-ink-muted">
              레슨을 완료하면 이력이 여기에 표시됩니다
            </p>
          </div>
          <Button asChild variant="primary" className="mt-2">
            <Link href="/explore">프로 찾아보기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Group lessons by year-month
  const groupedLessons = lessons.reduce(
    (acc, lesson) => {
      const date = new Date(lesson.start_at);
      const key = format(date, 'yyyy년 M월', { locale: ko });
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(lesson);
      return acc;
    },
    {} as Record<string, typeof lessons>
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedLessons).map(([monthKey, monthLessons]) => (
        <div key={monthKey}>
          <h3 className="mb-4 text-lg font-semibold text-tee-ink-strong">{monthKey}</h3>
          <div className="space-y-3">
            {monthLessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Pro Avatar */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    {lesson.pro?.profile_image_url ? (
                      <Image
                        src={lesson.pro.profile_image_url}
                        alt={lesson.pro.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-tee-accent-primary/10">
                        <span className="text-sm font-bold text-tee-accent-primary">
                          {lesson.pro?.title?.charAt(0) || 'P'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${lesson.pro?.slug}`}
                      className="font-semibold text-tee-ink-strong hover:text-tee-accent-primary"
                    >
                      {lesson.pro?.title || '프로'}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tee-ink-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(lesson.start_at), 'M월 d일 (E) HH:mm', { locale: ko })}
                      </span>

                      {lesson.pro?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {lesson.pro.location}
                        </span>
                      )}

                      {lesson.price_amount && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          {lesson.price_amount.toLocaleString()}원
                        </span>
                      )}
                    </div>

                    {lesson.customer_notes && (
                      <p className="mt-1 line-clamp-1 text-sm text-tee-ink-light">
                        {lesson.customer_notes}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span className="hidden sm:inline-flex items-center rounded-full bg-tee-success/10 px-3 py-1 text-xs font-medium text-tee-success">
                    완료
                  </span>

                  {/* Action */}
                  <Link
                    href={`/${lesson.pro?.slug}`}
                    className="hidden sm:flex items-center text-tee-ink-muted hover:text-tee-accent-primary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-tee-ink-strong">레슨 이력</h1>
        <p className="mt-1 text-sm text-tee-ink-muted">
          완료된 레슨 내역을 확인하세요
        </p>
      </div>

      {/* Lessons List */}
      <Suspense fallback={<LessonsSkeleton />}>
        <LessonsList />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: '레슨 이력 - TEE:UP',
  description: '완료된 레슨 내역을 확인하세요',
};
