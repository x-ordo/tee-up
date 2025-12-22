'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  getMyLessonLogs,
  getLessonStats,
  getMyStudents,
  type LessonLog,
  type LessonStats,
} from '@/actions';

// ============================================
// Stats Card Component
// ============================================

function StatsCard({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string | number;
  subValue?: string;
}) {
  return (
    <div className="rounded-lg border border-tee-stone bg-tee-surface p-4">
      <p className="text-sm text-tee-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-tee-ink-strong">{value}</p>
      {subValue && <p className="text-xs text-tee-ink-light">{subValue}</p>}
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function LessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonLog[]>([]);
  const [stats, setStats] = useState<LessonStats | null>(null);
  const [students, setStudents] = useState<{ id: string | null; name: string; lessonCount: number }[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [lessonsResult, statsResult, studentsResult] = await Promise.all([
          getMyLessonLogs({ limit: 20 }),
          getLessonStats(),
          getMyStudents(),
        ]);

        if (lessonsResult.success) setLessons(lessonsResult.data);
        if (statsResult.success) setStats(statsResult.data);
        if (studentsResult.success) setStudents(studentsResult.data);
      } catch (error) {
        console.error('Failed to fetch lesson data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter lessons by student
  useEffect(() => {
    async function filterLessons() {
      if (selectedStudent === 'all') {
        const result = await getMyLessonLogs({ limit: 20 });
        if (result.success) setLessons(result.data);
      } else {
        const student = students.find((s) =>
          s.id === selectedStudent || s.name === selectedStudent
        );
        if (student) {
          const result = await getMyLessonLogs({
            studentId: student.id || undefined,
            guestName: student.id ? undefined : student.name,
            limit: 20,
          });
          if (result.success) setLessons(result.data);
        }
      }
    }

    if (students.length > 0 || selectedStudent === 'all') {
      filterLessons();
    }
  }, [selectedStudent, students]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get lesson type label
  const getLessonTypeLabel = (type: string | null) => {
    const types: Record<string, string> = {
      individual: '개인 레슨',
      group: '그룹 레슨',
      online: '온라인 레슨',
      on_course: '필드 레슨',
    };
    return type ? types[type] || type : '레슨';
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tee-ink-strong">레슨 일지</h1>
          <p className="mt-1 text-sm text-tee-ink-light">
            수강생별 레슨 기록을 관리하고 성장 과정을 추적합니다.
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/lessons/new')}>
          + 새 일지 작성
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatsCard
            label="총 레슨"
            value={stats.total_lessons}
            subValue="회"
          />
          <StatsCard
            label="총 수강생"
            value={stats.total_students}
            subValue="명"
          />
          <StatsCard
            label="총 레슨 시간"
            value={stats.total_hours}
            subValue="시간"
          />
          <StatsCard
            label="이번 달 레슨"
            value={stats.this_month_lessons}
            subValue="회"
          />
        </div>
      )}

      {/* Student Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-tee-ink-strong">수강생 필터:</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="rounded-md border border-tee-stone bg-tee-surface px-3 py-2 text-sm text-tee-ink-strong focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
        >
          <option value="all">전체 수강생</option>
          {students.map((student) => (
            <option
              key={student.id || student.name}
              value={student.id || student.name}
            >
              {student.name} ({student.lessonCount}회)
            </option>
          ))}
        </select>
      </div>

      {/* Lesson List */}
      {lessons.length === 0 ? (
        <div className="rounded-lg border border-tee-stone bg-tee-surface p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-tee-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-tee-ink-light">아직 작성된 레슨 일지가 없습니다.</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/dashboard/lessons/new')}
          >
            첫 일지 작성하기
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dashboard/lessons/${lesson.id}`}
              className="block rounded-lg border border-tee-stone bg-tee-surface p-4 transition-colors hover:border-tee-accent-primary"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-tee-ink-strong">
                      {lesson.student_id ? '회원' : lesson.guest_name || '비회원'}
                    </span>
                    <span className="rounded bg-tee-stone px-2 py-0.5 text-xs text-tee-ink-light">
                      {getLessonTypeLabel(lesson.lesson_type)}
                    </span>
                    {lesson.is_shared_with_student && (
                      <span className="rounded bg-tee-accent-primary/10 px-2 py-0.5 text-xs text-tee-accent-primary">
                        공유됨
                      </span>
                    )}
                  </div>
                  {lesson.topic && (
                    <p className="mt-1 text-sm text-tee-ink-light">{lesson.topic}</p>
                  )}
                  {lesson.notes && (
                    <p className="mt-1 line-clamp-2 text-sm text-tee-ink-muted">
                      {lesson.notes}
                    </p>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-tee-ink-strong">
                    {formatDate(lesson.lesson_date)}
                  </p>
                  <p className="text-xs text-tee-ink-muted">
                    {lesson.duration_minutes}분
                  </p>
                </div>
              </div>

              {/* Metrics preview */}
              {Object.keys(lesson.metrics || {}).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-tee-stone pt-3">
                  {Object.entries(lesson.metrics).slice(0, 3).map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded bg-tee-background px-2 py-1 text-xs text-tee-ink-light"
                    >
                      {key}: {value}
                    </span>
                  ))}
                  {Object.keys(lesson.metrics).length > 3 && (
                    <span className="text-xs text-tee-ink-muted">
                      +{Object.keys(lesson.metrics).length - 3}개 더
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
