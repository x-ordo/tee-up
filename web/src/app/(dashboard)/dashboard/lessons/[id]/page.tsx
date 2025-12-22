'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MediaUploader, type MediaItem } from '@/components/upload/MediaUploader';
import {
  getLessonLog,
  updateLessonLog,
  deleteLessonLog,
  addLessonMedia,
  deleteLessonMedia,
  type LessonLogWithMedia,
  type UpdateLessonLogInput,
} from '@/actions';

// ============================================
// Types
// ============================================

interface PageProps {
  params: Promise<{ id: string }>;
}

// ============================================
// Main Component
// ============================================

export default function LessonDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonLogWithMedia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<UpdateLessonLogInput>({});
  const [metricsInput, setMetricsInput] = useState<{ key: string; value: string }[]>([]);

  // Fetch lesson data
  useEffect(() => {
    async function fetchLesson() {
      setIsLoading(true);
      try {
        const result = await getLessonLog(id);
        if (result.success && result.data) {
          setLesson(result.data);
          setFormData({
            lessonDate: result.data.lesson_date,
            durationMinutes: result.data.duration_minutes,
            lessonType: result.data.lesson_type || undefined,
            topic: result.data.topic || undefined,
            notes: result.data.notes || undefined,
            homework: result.data.homework || undefined,
            skillLevel: result.data.skill_level || undefined,
            progressNotes: result.data.progress_notes || undefined,
            isSharedWithStudent: result.data.is_shared_with_student,
          });
          setMetricsInput(
            Object.entries(result.data.metrics || {}).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          );
        } else {
          setError('error' in result ? result.error : '레슨 일지를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('레슨 일지를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLesson();
  }, [id]);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle metrics changes
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

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
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

      const result = await updateLessonLog(id, {
        ...formData,
        metrics,
      });

      if (result.success) {
        setIsEditing(false);
        // Refresh lesson data
        const refreshed = await getLessonLog(id);
        if (refreshed.success) {
          setLesson(refreshed.data);
        }
      } else {
        setError(result.error || '저장에 실패했습니다.');
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('정말로 이 레슨 일지를 삭제하시겠습니까?')) return;

    try {
      const result = await deleteLessonLog(id);
      if (result.success) {
        router.push('/dashboard/lessons');
      } else {
        setError(result.error || '삭제에 실패했습니다.');
      }
    } catch {
      setError('삭제 중 오류가 발생했습니다.');
    }
  };

  // Handle media upload complete
  const handleMediaUploadComplete = async (media: MediaItem[]) => {
    // Add new media to database
    const newMedia = media.filter(
      (m) => !lesson?.media.some((existing) => existing.url === m.url)
    );

    for (const item of newMedia) {
      await addLessonMedia(id, {
        mediaType: item.mediaType,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        storagePath: item.path,
        fileName: item.fileName,
        fileSize: item.fileSize,
        durationSeconds: item.duration,
      });
    }

    // Refresh lesson data
    const refreshed = await getLessonLog(id);
    if (refreshed.success) {
      setLesson(refreshed.data);
    }
  };

  // Handle media delete
  const handleMediaDelete = async (mediaId: string) => {
    const result = await deleteLessonMedia(mediaId);
    if (result.success) {
      setLesson((prev) =>
        prev
          ? {
              ...prev,
              media: prev.media.filter((m) => m.id !== mediaId),
            }
          : null
      );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-tee-accent-primary border-t-transparent" />
      </div>
    );
  }

  if (error && !lesson) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => router.push('/dashboard/lessons')}
        >
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
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
          <h1 className="text-2xl font-bold text-tee-ink-strong">
            {lesson.student_id ? '회원 레슨' : lesson.guest_name || '비회원 레슨'}
          </h1>
          <p className="mt-1 text-sm text-tee-ink-light">
            {formatDate(lesson.lesson_date)}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                취소
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                수정
              </Button>
              <Button
                variant="secondary"
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50"
              >
                삭제
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Lesson Info Card */}
          <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-tee-ink-strong">레슨 정보</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-tee-ink-light">날짜</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="lessonDate"
                    value={formData.lessonDate || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-tee-ink-strong">{formatDate(lesson.lesson_date)}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-tee-ink-light">레슨 시간</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes || 60}
                    onChange={handleChange}
                    min={15}
                    step={15}
                    className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-tee-ink-strong">{lesson.duration_minutes}분</p>
                )}
              </div>

              {/* Lesson Type */}
              <div>
                <label className="block text-sm font-medium text-tee-ink-light">레슨 유형</label>
                {isEditing ? (
                  <select
                    name="lessonType"
                    value={formData.lessonType || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                  >
                    <option value="">선택</option>
                    <option value="individual">개인 레슨</option>
                    <option value="group">그룹 레슨</option>
                    <option value="online">온라인 레슨</option>
                    <option value="on_course">필드 레슨</option>
                  </select>
                ) : (
                  <p className="mt-1 text-tee-ink-strong">
                    {lesson.lesson_type === 'individual' && '개인 레슨'}
                    {lesson.lesson_type === 'group' && '그룹 레슨'}
                    {lesson.lesson_type === 'online' && '온라인 레슨'}
                    {lesson.lesson_type === 'on_course' && '필드 레슨'}
                    {!lesson.lesson_type && '-'}
                  </p>
                )}
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-tee-ink-light">실력 수준</label>
                {isEditing ? (
                  <select
                    name="skillLevel"
                    value={formData.skillLevel || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                  >
                    <option value="">선택</option>
                    <option value="beginner">입문</option>
                    <option value="intermediate">중급</option>
                    <option value="advanced">상급</option>
                    <option value="pro">프로</option>
                  </select>
                ) : (
                  <p className="mt-1 text-tee-ink-strong">
                    {lesson.skill_level === 'beginner' && '입문'}
                    {lesson.skill_level === 'intermediate' && '중급'}
                    {lesson.skill_level === 'advanced' && '상급'}
                    {lesson.skill_level === 'pro' && '프로'}
                    {!lesson.skill_level && '-'}
                  </p>
                )}
              </div>
            </div>

            {/* Topic */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-tee-ink-light">레슨 주제</label>
              {isEditing ? (
                <input
                  type="text"
                  name="topic"
                  value={formData.topic || ''}
                  onChange={handleChange}
                  placeholder="예: 드라이버 스윙 교정"
                  className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                />
              ) : (
                <p className="mt-1 text-tee-ink-strong">{lesson.topic || '-'}</p>
              )}
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-tee-ink-light">레슨 내용</label>
              {isEditing ? (
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="레슨 중 진행한 내용을 기록합니다..."
                  className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                />
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-tee-ink-strong">
                  {lesson.notes || '-'}
                </p>
              )}
            </div>

            {/* Homework */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-tee-ink-light">과제 / 연습 사항</label>
              {isEditing ? (
                <textarea
                  name="homework"
                  value={formData.homework || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="다음 레슨까지 연습할 내용..."
                  className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                />
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-tee-ink-strong">
                  {lesson.homework || '-'}
                </p>
              )}
            </div>

            {/* Progress Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-tee-ink-light">성장 기록</label>
              {isEditing ? (
                <textarea
                  name="progressNotes"
                  value={formData.progressNotes || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="수강생의 성장 및 변화 기록..."
                  className="mt-1 w-full rounded-md border border-tee-stone bg-tee-background px-3 py-2 text-sm focus:border-tee-accent-primary focus:outline-none"
                />
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-tee-ink-strong">
                  {lesson.progress_notes || '-'}
                </p>
              )}
            </div>

            {/* Share with Student */}
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isSharedWithStudent"
                  checked={isEditing ? formData.isSharedWithStudent : lesson.is_shared_with_student}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 rounded border-tee-stone text-tee-accent-primary focus:ring-tee-accent-primary"
                />
                <span className="text-sm text-tee-ink-light">수강생에게 공유</span>
              </label>
            </div>
          </div>

          {/* Media Section */}
          <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-tee-ink-strong">
              미디어 ({lesson.media.length}개)
            </h2>

            {isEditing ? (
              <MediaUploader
                userId={lesson.pro_id}
                folder="lessons"
                maxFiles={20}
                initialMedia={lesson.media.map((m) => ({
                  id: m.id,
                  url: m.url,
                  thumbnailUrl: m.thumbnail_url || undefined,
                  path: m.storage_path || '',
                  mediaType: m.media_type,
                  fileName: m.file_name || 'file',
                  fileSize: m.file_size || 0,
                  duration: m.duration_seconds || undefined,
                }))}
                onUploadComplete={handleMediaUploadComplete}
                onError={(error) => setError(error)}
              />
            ) : lesson.media.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {lesson.media.map((media) => (
                  <div
                    key={media.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-tee-stone"
                  >
                    {media.media_type === 'image' ? (
                      <img
                        src={media.thumbnail_url || media.url}
                        alt={media.title || 'Lesson media'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg
                          className="h-12 w-12 text-tee-ink-muted"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-tee-ink-muted">
                첨부된 미디어가 없습니다. 수정 모드에서 추가할 수 있습니다.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Metrics */}
        <div className="space-y-6">
          <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-tee-ink-strong">측정 기록</h2>

            {isEditing ? (
              <div className="space-y-3">
                {metricsInput.map((metric, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="항목"
                      value={metric.key}
                      onChange={(e) => handleMetricChange(index, 'key', e.target.value)}
                      className="flex-1 rounded-md border border-tee-stone bg-tee-background px-2 py-1.5 text-sm focus:border-tee-accent-primary focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="값"
                      value={metric.value}
                      onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                      className="w-20 rounded-md border border-tee-stone bg-tee-background px-2 py-1.5 text-sm focus:border-tee-accent-primary focus:outline-none"
                    />
                    <button
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
                  onClick={addMetric}
                  className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-tee-stone py-2 text-sm text-tee-ink-muted hover:border-tee-accent-primary hover:text-tee-accent-primary"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  항목 추가
                </button>
              </div>
            ) : Object.keys(lesson.metrics || {}).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(lesson.metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md bg-tee-background px-3 py-2"
                  >
                    <span className="text-sm text-tee-ink-light">{key}</span>
                    <span className="font-medium text-tee-ink-strong">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-tee-ink-muted">
                측정 기록이 없습니다.
              </p>
            )}
          </div>

          {/* Common Metrics Suggestions */}
          {isEditing && (
            <div className="rounded-lg border border-tee-stone bg-tee-surface p-6">
              <h3 className="mb-3 text-sm font-medium text-tee-ink-light">추천 항목</h3>
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
                    onClick={() => setMetricsInput((prev) => [...prev, { key: suggestion, value: '' }])}
                    className="rounded-full border border-tee-stone px-3 py-1 text-xs text-tee-ink-light hover:border-tee-accent-primary hover:text-tee-accent-primary"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
