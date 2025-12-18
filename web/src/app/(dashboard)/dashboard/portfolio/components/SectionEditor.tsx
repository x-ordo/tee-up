'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { PortfolioSection } from '@/actions/portfolios';
import { updatePortfolioSection } from '@/actions/portfolios';
import type { EditorProfile } from '../PortfolioEditorClient';

interface SectionEditorProps {
  section: PortfolioSection;
  profile: EditorProfile;
  onUpdate: (section: PortfolioSection) => void;
  disabled?: boolean;
}

// Section-specific field definitions
type FieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'array';
  placeholder?: string;
  description?: string;
};

const SECTION_FIELDS: Record<string, FieldConfig[]> = {
  hero: [
    { name: 'headline', label: '헤드라인', type: 'text', placeholder: '프로 골퍼 김철수입니다' },
    { name: 'subheadline', label: '서브헤드라인', type: 'text', placeholder: '20년 경력의 레슨 전문가' },
    { name: 'cta_text', label: 'CTA 버튼 텍스트', type: 'text', placeholder: '레슨 문의하기' },
    { name: 'background_image_url', label: '배경 이미지 URL', type: 'url', placeholder: 'https://...' },
  ],
  gallery: [
    { name: 'images', label: '이미지 URL (한 줄에 하나씩)', type: 'array', placeholder: 'https://...', description: '최대 10개까지 추가할 수 있습니다' },
  ],
  stats: [
    { name: 'stat1_value', label: '통계 1 값', type: 'text', placeholder: '20+' },
    { name: 'stat1_label', label: '통계 1 라벨', type: 'text', placeholder: '년 경력' },
    { name: 'stat2_value', label: '통계 2 값', type: 'text', placeholder: '1,000+' },
    { name: 'stat2_label', label: '통계 2 라벨', type: 'text', placeholder: '명 레슨' },
    { name: 'stat3_value', label: '통계 3 값', type: 'text', placeholder: '4.9' },
    { name: 'stat3_label', label: '통계 3 라벨', type: 'text', placeholder: '평점' },
  ],
  testimonials: [
    { name: 'testimonials', label: '후기 (JSON 배열)', type: 'textarea', placeholder: '[{"name": "홍길동", "content": "훌륭한 레슨이었습니다!", "rating": 5}]', description: 'JSON 형식으로 입력: [{"name": "이름", "content": "내용", "rating": 5}]' },
  ],
  contact: [
    { name: 'title', label: '제목', type: 'text', placeholder: '연락처' },
    { name: 'description', label: '설명', type: 'textarea', placeholder: '레슨 문의는 아래 연락처로 해주세요.' },
    { name: 'show_email', label: '이메일 표시', type: 'text', placeholder: 'true 또는 false' },
    { name: 'show_phone', label: '전화번호 표시', type: 'text', placeholder: 'true 또는 false' },
    { name: 'show_kakao', label: '카카오톡 표시', type: 'text', placeholder: 'true 또는 false' },
  ],
  curriculum: [
    { name: 'title', label: '제목', type: 'text', placeholder: '레슨 커리큘럼' },
    { name: 'items', label: '커리큘럼 항목 (JSON 배열)', type: 'textarea', placeholder: '[{"title": "기초반", "description": "골프 입문자를 위한 과정", "duration": "8주"}]', description: 'JSON 형식: [{"title": "제목", "description": "설명", "duration": "기간"}]' },
  ],
  pricing: [
    { name: 'title', label: '제목', type: 'text', placeholder: '레슨 가격표' },
    { name: 'plans', label: '가격 플랜 (JSON 배열)', type: 'textarea', placeholder: '[{"name": "1회 레슨", "price": "100,000원", "features": ["1시간 레슨", "스윙 분석"]}]', description: 'JSON 형식: [{"name": "플랜명", "price": "가격", "features": ["특징1", "특징2"]}]' },
  ],
  faq: [
    { name: 'title', label: '제목', type: 'text', placeholder: '자주 묻는 질문' },
    { name: 'items', label: 'FAQ 항목 (JSON 배열)', type: 'textarea', placeholder: '[{"question": "질문?", "answer": "답변"}]', description: 'JSON 형식: [{"question": "질문", "answer": "답변"}]' },
  ],
  instagram_feed: [
    { name: 'instagram_username', label: '인스타그램 사용자명', type: 'text', placeholder: 'golf_pro_kim' },
    { name: 'post_count', label: '표시할 게시물 수', type: 'text', placeholder: '6' },
  ],
  youtube_embed: [
    { name: 'videos', label: '유튜브 동영상 URL (한 줄에 하나씩)', type: 'array', placeholder: 'https://www.youtube.com/watch?v=...', description: '최대 6개까지 추가할 수 있습니다' },
  ],
  custom: [
    { name: 'title', label: '제목', type: 'text', placeholder: '섹션 제목' },
    { name: 'content', label: '내용 (HTML 지원)', type: 'textarea', placeholder: '<p>내용을 입력하세요</p>' },
  ],
};

export default function SectionEditor({
  section,
  profile,
  onUpdate,
  disabled,
}: SectionEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get field definitions for this section type
  const fields = SECTION_FIELDS[section.section_type] || SECTION_FIELDS.custom;

  // Local state for form values
  const [formData, setFormData] = useState<Record<string, unknown>>(
    section.content || {}
  );

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setSuccess(false);
  };

  const handleArrayFieldChange = (fieldName: string, value: string) => {
    // Split by newlines for array fields
    const arrayValue = value.split('\n').filter((line) => line.trim());
    setFormData((prev) => ({
      ...prev,
      [fieldName]: arrayValue,
    }));
    setSuccess(false);
  };

  const handleSave = () => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updatePortfolioSection(section.id, {
        content: formData,
      });

      if (result.success) {
        onUpdate(result.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error);
      }
    });
  };

  const handleTitleChange = (title: string) => {
    startTransition(async () => {
      const result = await updatePortfolioSection(section.id, { title });

      if (result.success) {
        onUpdate(result.data);
      } else {
        setError(result.error);
      }
    });
  };

  // Helper to get field value
  const getFieldValue = (fieldName: string, fieldType: string): string => {
    const value = formData[fieldName];
    if (value === undefined || value === null) return '';
    if (fieldType === 'array' && Array.isArray(value)) {
      return value.join('\n');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <label className="text-sm font-medium text-tee-ink-strong">섹션 제목</label>
        <Input
          value={section.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="섹션 제목"
          className="mt-1"
          disabled={disabled || isPending}
        />
      </div>

      {/* Dynamic Fields Based on Section Type */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-tee-ink-strong">콘텐츠</h4>

        {fields.map((field) => (
          <div key={field.name}>
            <label className="text-sm font-medium text-tee-ink-light">
              {field.label}
            </label>
            {field.description && (
              <p className="text-xs text-tee-ink-muted mb-1">{field.description}</p>
            )}

            {field.type === 'textarea' || field.type === 'array' ? (
              <textarea
                value={getFieldValue(field.name, field.type)}
                onChange={(e) =>
                  field.type === 'array'
                    ? handleArrayFieldChange(field.name, e.target.value)
                    : handleFieldChange(field.name, e.target.value)
                }
                placeholder={field.placeholder}
                rows={5}
                disabled={disabled || isPending}
                className="mt-1 w-full rounded-lg border border-tee-stone bg-tee-surface px-3 py-2 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary disabled:opacity-50"
              />
            ) : (
              <Input
                type={field.type}
                value={getFieldValue(field.name, field.type)}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1"
                disabled={disabled || isPending}
              />
            )}
          </div>
        ))}
      </div>

      {/* Profile Data Reference */}
      <div className="rounded-lg bg-tee-stone/30 p-4">
        <h4 className="text-sm font-medium text-tee-ink-strong mb-2">
          프로필 정보 참조
        </h4>
        <div className="grid gap-2 text-xs text-tee-ink-light">
          <p><span className="font-medium">이름:</span> {profile.title}</p>
          <p><span className="font-medium">위치:</span> {profile.location || '미설정'}</p>
          <p><span className="font-medium">카카오톡:</span> {profile.open_chat_url ? '설정됨' : '미설정'}</p>
          <p><span className="font-medium">인스타그램:</span> {profile.instagram_username || '미설정'}</p>
          <p><span className="font-medium">특기:</span> {profile.specialties.length > 0 ? profile.specialties.join(', ') : '미설정'}</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-tee-error/20 bg-tee-error/5 p-4">
          <p className="text-sm text-tee-error">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-lg border border-tee-success/20 bg-tee-success/5 p-4">
          <p className="text-sm text-tee-success">저장되었습니다.</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={disabled || isPending}>
          {isPending ? '저장 중...' : '변경사항 저장'}
        </Button>
      </div>
    </div>
  );
}
