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

const SECTION_SAMPLE_CONTENT: Record<string, Record<string, unknown>> = {
  gallery: {
    subtitle: '투어 무대와 프라이빗 레슨의 시그니처 모먼트',
    images: [
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500534314209-a26db0f5c0f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  testimonials: {
    subtitle: '컨시어지 기반 정밀 피드백으로 완성한 퍼포먼스 변화',
    testimonials: [
      {
        name: '강민주',
        quote: '임팩트 라인 정렬 이후 평균 스코어가 5타 줄었습니다.',
        rating: 5,
      },
      {
        name: '박준호',
        quote: '데이터 기반 리포트 덕분에 드라이버 정확도가 눈에 띄게 개선됐어요.',
        rating: 5,
      },
      {
        name: '이현서',
        quote: '투어 루틴 코칭으로 라운드 후반 집중력이 크게 올라갔습니다.',
        rating: 4,
      },
    ],
  },
  achievements: {
    subtitle: '투어 커리어와 메이저 하이라이트',
    items: [
      {
        title: 'The Genesis Invitational Top 5',
        tour_or_event: 'PGA Tour',
        year: '2024',
        placement: 'Top 5',
        note: '메이저 개인 최고 성적',
      },
      {
        title: 'PGA Championship Top 10',
        tour_or_event: 'Major',
        year: '2023',
        placement: 'Top 10',
        note: '시즌 최저타 기록',
      },
    ],
  },
  sponsorships: {
    subtitle: '공식 파트너십 및 글로벌 앰버서더',
    items: [
      {
        brand_name: 'Titleist',
        role: 'Global Ambassador',
        contract_period: '2024-2026',
        link: 'https://www.titleist.com',
      },
      {
        brand_name: 'FootJoy',
        role: 'Signature Partner',
        contract_period: '2023-2025',
        link: 'https://www.footjoy.com',
      },
    ],
  },
  media: {
    subtitle: '프리미엄 인터뷰 및 보도 하이라이트',
    items: [
      {
        outlet: 'Golf Digest Korea',
        headline: '정확도 중심의 투어 루틴 단독 인터뷰',
        date: '2024-05',
        link: 'https://golfdigest.co.kr',
        media_type: 'Interview',
      },
      {
        outlet: 'JTBC Golf',
        headline: '투어 하이라이트 특집 출연',
        date: '2024-03',
        link: 'https://golf.jtbc.co.kr',
        media_type: 'Broadcast',
      },
    ],
  },
  availability: {
    subtitle: '프라이빗 레슨 우선 배정 기준',
    items: [
      {
        region: '서울 · 경기',
        cadence: '주 2회 (협의)',
        preferred_days: '화/목',
        time_window: '14:00-18:00',
        seasonality: '투어 일정 제외 기간 우선',
      },
    ],
  },
  curriculum: {
    subtitle: '투어 경험 기반 시그니처 프로그램',
    items: [
      {
        title: 'Signature Fundamentals',
        description: '스윙 축과 임팩트 라인 정렬을 정교하게 설계합니다.',
        duration: '6주',
      },
      {
        title: 'Tour Precision Lab',
        description: '탄도·스핀·거리 데이터를 기반으로 샷 메이킹을 최적화합니다.',
        duration: '8주',
      },
      {
        title: 'Championship Strategy',
        description: '코스 매니지먼트, 멘탈 루틴, 스코어링 전략을 완성합니다.',
        duration: '4주',
      },
    ],
  },
  pricing: {
    subtitle: '프라이빗 레슨 기준 · 컨시어지 일정 조율',
    plans: [
      {
        name: 'Atelier Private',
        duration: '60분',
        price: '₩220,000',
        features: ['1:1 퍼스널 진단', '스윙 영상 리포트', '맞춤 드릴 제공'],
      },
      {
        name: 'Signature 8',
        duration: '8회 패키지',
        price: '₩1,600,000',
        features: ['개인 맞춤 커리큘럼', '라운드 동행 1회', '데이터 리포트 제공'],
        popular: true,
      },
      {
        name: 'Tour Elite',
        duration: '16회 패키지',
        price: '₩3,800,000',
        features: ['투어 루틴 컨설팅', '컨시어지 우선 예약', '전 과정 리포트'],
      },
    ],
  },
  faq: {
    subtitle: '컨시어지 운영 기준과 진행 절차',
    items: [
      {
        question: '레슨 확정까지 소요 시간은 얼마나 걸리나요?',
        answer: '평균 24시간 내에 일정 후보를 제안드리고 48시간 내 확정합니다.',
      },
      {
        question: '일정 변경이나 취소는 어떻게 하나요?',
        answer: '레슨 24시간 전까지 컨시어지 채널로 요청 시 무료 변경이 가능합니다.',
      },
    ],
  },
  instagram_feed: {
    subtitle: '투어 일상과 프라이빗 레슨 하이라이트',
    instagram_username: 'golf_pro_kim',
    post_count: 6,
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500534314209-a26db0f5c0f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  youtube_embed: {
    subtitle: '테크닉과 전략 인사이트',
    videos: [
      'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      'https://www.youtube.com/watch?v=9bZkp7q19f0',
    ],
  },
};

const SECTION_FIELDS: Record<string, FieldConfig[]> = {
  hero: [
    { name: 'headline', label: '헤드라인', type: 'text', placeholder: '프로 골퍼 김철수입니다' },
    { name: 'subheadline', label: '서브헤드라인', type: 'text', placeholder: '20년 경력의 레슨 전문가' },
    { name: 'cta_text', label: 'CTA 버튼 텍스트', type: 'text', placeholder: '레슨 문의하기' },
    { name: 'background_image_url', label: '배경 이미지 URL', type: 'url', placeholder: 'https://...' },
  ],
  gallery: [
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '투어와 프라이빗 레슨의 시그니처 모먼트' },
    { name: 'images', label: '이미지 URL (한 줄에 하나씩)', type: 'array', placeholder: 'https://images.unsplash.com/...', description: '최대 10개까지 추가할 수 있습니다' },
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
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '컨시어지 기반 프리미엄 후기' },
    { name: 'testimonials', label: '후기 (JSON 배열)', type: 'textarea', placeholder: '[{"name": "강민주", "quote": "임팩트 라인 정렬 이후 평균 스코어가 5타 줄었습니다.", "rating": 5}]', description: 'JSON 형식: [{"name": "이름", "quote": "내용", "rating": 5, "avatar": "선택"}]' },
  ],
  achievements: [
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '투어 커리어와 메이저 하이라이트' },
    { name: 'items', label: '투어/수상 (JSON 배열)', type: 'textarea', placeholder: '[{"title": "The Genesis Invitational Top 5", "tour_or_event": "PGA Tour", "year": "2024", "placement": "Top 5", "note": "메이저 개인 최고 성적"}]', description: 'JSON 형식: [{"title": "타이틀", "tour_or_event": "대회/투어", "year": "연도", "placement": "성적", "note": "비고"}]' },
  ],
  sponsorships: [
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '공식 파트너십 & 글로벌 앰버서더' },
    { name: 'items', label: '스폰서 (JSON 배열)', type: 'textarea', placeholder: '[{"brand_name": "Titleist", "role": "Signature Ambassador", "contract_period": "2024-2026", "link": "https://titleist.com", "logo_url": "https://..."}]', description: 'JSON 형식: [{"brand_name": "브랜드", "role": "역할", "contract_period": "기간", "link": "URL", "logo_url": "로고"}]' },
  ],
  media: [
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '프리미엄 인터뷰 및 보도 하이라이트' },
    { name: 'items', label: '미디어/보도 (JSON 배열)', type: 'textarea', placeholder: '[{"outlet": "Golf Digest Korea", "headline": "정확도 중심의 투어 루틴 단독 인터뷰", "date": "2024-05", "link": "https://...", "media_type": "Interview", "thumbnail_url": "https://..."}]', description: 'JSON 형식: [{"outlet": "매체", "headline": "제목", "date": "날짜", "link": "URL", "media_type": "형태", "thumbnail_url": "썸네일"}]' },
  ],
  availability: [
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '프라이빗 레슨 우선 배정 기준' },
    { name: 'items', label: '가용 일정 (JSON 배열)', type: 'textarea', placeholder: '[{"region": "서울 · 경기", "cadence": "주 2회(협의)", "preferred_days": "화/목", "time_window": "14:00-18:00", "seasonality": "투어 일정 제외 기간 우선"}]', description: 'JSON 형식: [{"region": "지역", "cadence": "빈도", "preferred_days": "선호 요일", "time_window": "시간대", "seasonality": "시즌"}]' },
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
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '투어 경험 기반 시그니처 프로그램' },
    { name: 'items', label: '커리큘럼 항목 (JSON 배열)', type: 'textarea', placeholder: '[{"title": "Signature Fundamentals", "description": "스윙 축과 임팩트 라인 정렬을 정교하게 설계합니다.", "duration": "6주"}]', description: 'JSON 형식: [{"title": "제목", "description": "설명", "duration": "기간"}]' },
  ],
  pricing: [
    { name: 'title', label: '제목', type: 'text', placeholder: '레슨 가격표' },
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '프라이빗 레슨 기준 · 컨시어지 일정 조율' },
    { name: 'plans', label: '가격 플랜 (JSON 배열)', type: 'textarea', placeholder: '[{"name": "Atelier Private", "duration": "60분", "price": "₩220,000", "features": ["1:1 퍼스널 진단", "스윙 영상 리포트"], "popular": true}]', description: 'JSON 형식: [{"name": "플랜명", "duration": "기간", "price": "가격", "features": ["특징1", "특징2"], "popular": true}]' },
  ],
  faq: [
    { name: 'title', label: '제목', type: 'text', placeholder: '자주 묻는 질문' },
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '컨시어지 운영 기준 안내' },
    { name: 'items', label: 'FAQ 항목 (JSON 배열)', type: 'textarea', placeholder: '[{"question": "레슨 확정까지 소요 시간은?", "answer": "평균 24시간 내 1차 안내가 진행됩니다."}]', description: 'JSON 형식: [{"question": "질문", "answer": "답변"}]' },
  ],
  instagram_feed: [
    { name: 'instagram_username', label: '인스타그램 사용자명', type: 'text', placeholder: 'golf_pro_kim' },
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '투어 일상과 프라이빗 레슨 하이라이트' },
    { name: 'post_count', label: '표시할 게시물 수', type: 'text', placeholder: '6' },
    { name: 'images', label: '게시물 이미지 URL (한 줄에 하나씩)', type: 'array', placeholder: 'https://images.unsplash.com/...', description: '미리보기용 이미지, 최대 12개' },
  ],
  youtube_embed: [
    { name: 'subtitle', label: '서브타이틀', type: 'text', placeholder: '테크닉과 전략 인사이트' },
    { name: 'videos', label: '유튜브 동영상 URL (한 줄에 하나씩)', type: 'array', placeholder: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', description: '최대 6개까지 추가할 수 있습니다' },
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
  const sampleContent = SECTION_SAMPLE_CONTENT[section.section_type];

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

  const handleApplySample = () => {
    if (!sampleContent) return;
    setFormData(sampleContent);
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
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-tee-ink-strong">콘텐츠</h4>
          {sampleContent && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplySample}
              disabled={disabled || isPending}
            >
              샘플 입력
            </Button>
          )}
        </div>

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
