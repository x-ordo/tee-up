import Link from 'next/link';
import { getMyLessonLogs } from '@/actions/lessons';
import LessonLogCard from '@/components/features/LessonLogCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const metadata = {
  title: '레슨 일지 | TEE:UP',
  description: '나의 레슨 일지를 관리하고 수강생의 성장을 기록하세요.',
};

export default async function LessonLogsPage() {
  const { data: lessonLogs, error } = await getMyLessonLogs();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-destructive bg-tee-surface-strong p-8 text-center text-destructive">
        <p>레슨 일지를 불러오는 중 오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tee-ink-strong">레슨 일지</h1>
          <p className="text-tee-ink-light">
            수강생과의 모든 레슨을 기록하고 관리하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/lessons/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            새 레슨 일지 작성
          </Link>
        </Button>
      </div>

      {/* Lesson Logs List */}
      {lessonLogs && lessonLogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessonLogs.map((log) => (
            <LessonLogCard
              key={log.id}
              lesson={log}
              studentName={log.student_name || log.guest_name || '비회원'}
              isLinked={true}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-tee-surface-strong text-center">
          <h2 className="text-xl font-semibold text-tee-ink-strong">
            아직 작성된 레슨 일지가 없습니다.
          </h2>
          <p className="mt-2 text-tee-ink-light">
            첫 레슨 일지를 작성하고 수강생의 성장을 기록해보세요.
          p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/lessons/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              첫 레슨 일지 작성하기
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
