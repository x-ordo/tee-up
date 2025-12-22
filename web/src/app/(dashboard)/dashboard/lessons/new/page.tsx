'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MediaUploader, type MediaItem } from '@/components/upload/MediaUploader';
import {
  createLessonLog,
  getMyStudents,
  addLessonMedia,
  type CreateLessonLogInput,
} from '@/actions';
import { createClient } from '@/lib/supabase/client';

// ============================================
// Types
// ============================================

interface Student {
  id: string | null;
  name: string;
  lessonCount: number;
}

// ============================================
// Main Component
// ============================================

export default function NewLessonPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [studentType, setStudentType] = useState<'existing' | 'guest'>('existing');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [lessonDate, setLessonDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [lessonType, setLessonType] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [homework, setHomework] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [progressNotes, setProgressNotes] = useState('');
  const [isSharedWithStudent, setIsSharedWithStudent] = useState(true);
  const [metricsInput, setMetricsInput] = useState<{ key: string; value: string }[]>([]);
  const [pendingMedia, setPendingMedia] = useState<MediaItem[]>([]);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Get current user
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }

        // Get existing students
        const studentsResult = await getMyStudents();
        if (studentsResult.success) {
          setStudents(studentsResult.data);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle metrics
  const handleMetricChange = (index: number, field: 'key' | 'value', value: string) => {
    setMetricsInput((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMetric = () => {
    setMetricsInput((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeMetric = (index: number) => {
    setMetricsInput((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate
      if (studentType === 'existing' && !selectedStudentId) {
        setError('수강생을 선택해주세요.');
        setIsSaving(false);
        return;
      }
      if (studentType === 'guest' && !guestName) {
        setError('수강생 이름을 입력해주세요.');
        setIsSaving(false);
        return;
      }

      // Build metrics object
      const metrics: Record<string, number> = {};
      metricsInput.forEach(({ key, value }) => {
        if (key && value) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            metrics[key] = numValue;
          }
        }
      });

      // Create lesson log
      const input: CreateLessonLogInput = {
        lessonDate,
        durationMinutes,
        lessonType: lessonType || undefined,
        topic: topic || undefined,
        notes: notes || undefined,
        homework: homework || undefined,
        skillLevel: skillLevel || undefined,
        progressNotes: progressNotes || undefined,
        isSharedWithStudent,
        metrics: Object.keys(metrics).length > 0 ? metrics : undefined,
      };

      if (studentType === 'existing') {
        const student = students.find(
          (s) => s.id === selectedStudentId || s.name === selectedStudentId
        );
        if (student) {
          input.studentId = student.id || undefined;
          input.guestName = student.id ? undefined : student.name;
        }
      } else {
        input.guestName = guestName;
        input.guestPhone = guestPhone || undefined;
      }

      const result = await createLessonLog(input);

      if (!result.success) {
        setError(result.error || '레슨 일지 생성에 실패했습니다.');
        setIsSaving(false);
        return;
      }

      // Add pending media
      if (pendingMedia.length > 0 && result.data) {
        for (const media of pendingMedia) {
          await addLessonMedia(result.data.id, {
            mediaType: media.mediaType,
            url: media.url,
            thumbnailUrl: media.thumbnailUrl,
            storagePath: media.path,
            fileName: media.fileName,
            fileSize: media.fileSize,
            durationSeconds: media.duration,
          });
        }
      }

      // Navigate to the new lesson
      router.push(`/dashboard/lessons/${result.data?.id}`);
    } catch {
      setError('레슨 일지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="mb-2 flex items-center gap-1 text-sm text-tee-ink-muted hover:text-tee-ink-strong"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로가기
        </button>
        <h1 className="text-2xl font-bold text-tee-ink-strong">새 레슨 일지</h1>
        <p className="mt-1 text-sm text-tee-ink-light">
          레슨 내용과 수강생의 성장 기록을 남겨보세요.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Selection */}
        <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-tee-ink-strong">수강생 정보</h2>

          {/* Student Type Toggle */}
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setStudentType('existing')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                studentType === 'existing'
                  ? 'bg-tee-accent-primary text-white'
                  : 'bg-tee-stone text-tee-ink-light hover:bg-tee-ink-muted/20'
              }`}
            >
              기존 수강생
            </button>
            <button
              type="button"
              onClick={() => setStudentType('guest')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                studentType === 'guest'
                  ? 'bg-tee-accent-primary text-white'
                  : 'bg-tee-stone text-tee-ink-light hover:bg-tee-ink-muted/20'
              }`}
            >
              신규 수강생
            </button>
          </div>

          {studentType === 'existing' ? (
            <div>
              <label className="block text-sm font-medium text-tee-ink-light">수강생 선택</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                required={studentType === 'existing'}
              >
                <option value="">수강생을 선택하세요</option>
                {students.map((student) => (
                  <option
                    key={student.id || student.name}
                    value={student.id || student.name}
                  >
                    {student.name} ({student.lessonCount}회 레슨)
                  </option>
                ))}
              </select>
              {students.length === 0 && (
                <p className="mt-2 text-sm text-tee-ink-muted">
                  아직 등록된 수강생이 없습니다. 신규 수강생을 추가해주세요.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-tee-ink-light">이름 *</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="수강생 이름"
                  className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                  required={studentType === 'guest'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tee-ink-light">연락처</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-tee-ink-strong">레슨 정보</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-tee-ink-light">레슨 날짜 *</label>
              <input
                type="date"
                value={lessonDate}
                onChange={(e) => setLessonDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-tee-ink-light">레슨 시간 (분)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                min={15}
                step={15}
                className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
              />
            </div>

            {/* Lesson Type */}
            <div>
              <label className="block text-sm font-medium text-tee-ink-light">레슨 유형</label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
              >
                <option value="">선택</option>
                <option value="individual">개인 레슨</option>
                <option value="group">그룹 레슨</option>
                <option value="online">온라인 레슨</option>
                <option value="on_course">필드 레슨</option>
              </select>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-tee-ink-light">실력 수준</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
              >
                <option value="">선택</option>
                <option value="beginner">입문</option>
                <option value="intermediate">중급</option>
                <option value="advanced">상급</option>
                <option value="pro">프로</option>
              </select>
            </div>
          </div>

          {/* Topic */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-tee-ink-light">레슨 주제</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 드라이버 스윙 교정"
              className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-tee-ink-light">레슨 내용</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="레슨 중 진행한 내용을 기록합니다..."
              className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
            />
          </div>

          {/* Homework */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-tee-ink-light">과제 / 연습 사항</label>
            <textarea
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              rows={3}
              placeholder="다음 레슨까지 연습할 내용..."
              className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
            />
          </div>

          {/* Progress Notes */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-tee-ink-light">성장 기록</label>
            <textarea
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
              rows={3}
              placeholder="수강생의 성장 및 변화 기록..."
              className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
            />
          </div>

          {/* Share Toggle */}
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSharedWithStudent}
                onChange={(e) => setIsSharedWithStudent(e.target.checked)}
                className="h-4 w-4 rounded border-tee-stone text-tee-accent-primary focus:ring-tee-accent-primary"
              />
              <span className="text-sm text-tee-ink-light">수강생에게 공유</span>
            </label>
          </div>
        </div>

        {/* Metrics */}
        <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-tee-ink-strong">측정 기록</h2>

          <div className="space-y-3">
            {metricsInput.map((metric, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="항목 (예: 드라이브 비거리)"
                  value={metric.key}
                  onChange={(e) => handleMetricChange(index, 'key', e.target.value)}
                  className="flex-1 rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="값"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                  className="w-24 rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeMetric(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMetric}
              className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-tee-stone py-2 text-sm text-tee-ink-muted hover:border-tee-accent-primary hover:text-tee-accent-primary"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              측정 항목 추가
            </button>
          </div>

          {/* Suggested Metrics */}
          <div className="mt-4">
            <p className="mb-2 text-sm text-tee-ink-muted">추천 항목:</p>
            <div className="flex flex-wrap gap-2">
              {[
                '드라이브 비거리',
                '클럽 헤드 스피드',
                '볼 스피드',
                '퍼팅 성공률',
                '핸디캡',
                '스윙 템포',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setMetricsInput((prev) => [...prev, { key: suggestion, value: '' }])}
                  className="rounded-full border border-tee-stone px-3 py-1 text-xs text-tee-ink-light hover:border-tee-accent-primary hover:text-tee-accent-primary"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media Upload */}
        {userId && (
          <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-tee-ink-strong">미디어 첨부</h2>
            <MediaUploader
              userId={userId}
              folder="lessons"
              maxFiles={20}
              onUploadComplete={(media) => setPendingMedia(media)}
              onError={(err) => setError(err)}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? '저장 중...' : '레슨 일지 저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}
