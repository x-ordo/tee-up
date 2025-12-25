'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLessonLog, updateLessonLog } from '@/actions/lessons';
import type { LessonLog, LessonLogInsert, LessonLogUpdate } from '@/actions/lessons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface LessonLogFormProps {
  initialData?: LessonLog;
}

export function LessonLogForm({ initialData }: LessonLogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<LessonLogInsert | LessonLogUpdate>>({});
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        lesson_date: initialData.lesson_date.split('T')[0], // Format date for input
      });
    } else {
      setFormData({
        lesson_date: new Date().toISOString().split('T')[0],
        duration_minutes: 60,
        lesson_type: 'individual',
        is_shared_with_student: true,
      });
    }
  }, [initialData]);

  const isEditMode = !!initialData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_shared_with_student: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = isEditMode
        ? await updateLessonLog(initialData.id, formData as LessonLogUpdate)
        : await createLessonLog(formData as LessonLogInsert);

      if (!result.success) {
        setError(result.error || '알 수 없는 오류가 발생했습니다.');
      } else {
        if (isEditMode) {
          setSuccess('레슨 일지가 성공적으로 업데이트되었습니다.');
        } else {
          router.push('/dashboard/lessons');
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="lesson_date" className="mb-2 block text-sm font-medium text-tee-ink-strong">
            레슨 날짜 <span className="text-destructive">*</span>
          </label>
          <Input
            id="lesson_date"
            name="lesson_date"
            type="date"
            required
            value={formData.lesson_date || ''}
            onChange={handleChange}
            className="w-full"
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="topic" className="mb-2 block text-sm font-medium text-tee-ink-strong">
            레슨 주제 <span className="text-destructive">*</span>
          </label>
          <Input
            id="topic"
            name="topic"
            placeholder="예: 드라이버 비거리 향상"
            required
            value={formData.topic || ''}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="guest_name" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          수강생 이름 (비회원)
        </label>
        <Input
          id="guest_name"
          name="guest_name"
          placeholder="예: 김세영"
          value={formData.guest_name || ''}
          onChange={handleChange}
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-tee-ink-light">
          등록된 회원의 경우, 추후 예약 내역에서 연결할 수 있습니다.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          레슨 노트
        </label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="오늘 레슨의 주요 내용과 수강생의 상태를 기록하세요."
          value={formData.notes || ''}
          onChange={handleChange}
          rows={5}
          disabled={isPending}
        />
      </div>
      
      <div>
        <label htmlFor="homework" className="mb-2 block text-sm font-medium text-tee-ink-strong">
          과제
        </label>
        <Textarea
          id="homework"
          name="homework"
          placeholder="다음 레슨 전까지 연습할 내용을 남겨주세요."
          value={formData.homework || ''}
          onChange={handleChange}
          rows={3}
          disabled={isPending}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is_shared_with_student"
          checked={!!formData.is_shared_with_student}
          onCheckedChange={handleCheckboxChange}
          disabled={isPending}
        />
        <label
          htmlFor="is_shared_with_student"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          이 일지를 수강생과 공유합니다.
        </label>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          뒤로가기
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? '저장 중...' : (isEditMode ? '레슨 일지 수정' : '레슨 일지 저장')}
        </Button>
      </div>
    </form>
  );
}
