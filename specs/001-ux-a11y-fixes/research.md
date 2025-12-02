# Research: UX 접근성 및 디자인 일관성 개선

**Feature**: 001-ux-a11y-fixes
**Date**: 2025-12-02
**Status**: Complete

## 1. 모바일 플로팅 CTA 패턴

### Decision
페이지 하단에 고정 위치 대신 **스크롤 감지 기반 표시/숨김** + **최소화 옵션** 구현

### Rationale
- 플로팅 CTA가 콘텐츠 20% 이상 가리는 현재 문제 해결
- 사용자가 스크롤 중일 때는 읽기에 집중하도록 CTA 숨김
- 스크롤 멈춤 후 일정 시간(1초) 지나면 CTA 재표시
- 모바일(< 768px)에서는 단일 버튼으로 축소

### Alternatives Considered
| 옵션 | 장점 | 단점 | 결정 |
|------|------|------|------|
| 페이지 하단 고정 배치 | 구현 단순 | 콘텐츠 항상 가림 | ❌ 기각 |
| 스크롤 감지 표시/숨김 | 읽기 경험 개선 | 구현 복잡도 증가 | ✅ 채택 |
| 접이식 FAB | 공간 절약 | 2-tap 필요 | 부분 채택 (모바일) |

### Implementation Notes
```typescript
// 스크롤 감지 훅 pseudo-code
const useScrollVisibility = () => {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(false);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(true), 1000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return visible;
};
```

---

## 2. 포커스 트랩 구현

### Decision
커스텀 `useFocusTrap` 훅 구현 (외부 라이브러리 미사용)

### Rationale
- 번들 크기 최소화 (외부 라이브러리 추가 없이 ~50줄)
- 프로젝트 요구사항에 맞게 커스터마이즈 가능
- React 18의 useId() 활용으로 고유 ID 생성

### Alternatives Considered
| 옵션 | 장점 | 단점 | 결정 |
|------|------|------|------|
| focus-trap 라이브러리 | 검증됨, 풍부한 옵션 | +15KB 번들, 과도한 기능 | ❌ 기각 |
| @radix-ui/react-dialog | 완전한 모달 솔루션 | 기존 BookingModal 전면 교체 필요 | ❌ 기각 |
| 커스텀 useFocusTrap 훅 | 경량, 제어 가능 | 직접 테스트 필요 | ✅ 채택 |

### Implementation Notes
```typescript
// useFocusTrap 핵심 로직
const useFocusTrap = (containerRef: RefObject<HTMLElement>, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      if (e.key === 'Escape') {
        // onClose callback
      }
    };

    firstElement?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
};
```

---

## 3. 디자인 토큰 확장 전략

### Decision
`global.css`에 외부 브랜드 색상용 별도 섹션 추가

### Rationale
- 카카오톡 등 서드파티 브랜드 색상은 디자인 시스템 색상과 분리 관리
- CSS 변수로 정의하여 일괄 수정 가능
- 하드코딩 색상값 제거로 유지보수성 향상

### Implementation Notes
```css
/* global.css - 외부 브랜드 색상 섹션 */
:root {
  /* === External Brand Colors === */
  --brand-kakao: #FEE500;
  --brand-kakao-text: #191919;
  --brand-kakao-hover: #FDD835;
}
```

---

## 4. 스크린 리더 호환성

### Decision
ARIA 속성 표준 패턴 적용 + `aria-live` 영역 활용

### Rationale
- 기존 VoiceOver/NVDA 테스트 결과 기반
- 동적 콘텐츠(로딩, 에러, 성공)에 `aria-live="polite"` 적용
- 아이콘 전용 버튼에 `aria-label` 필수 적용

### Implementation Notes
```tsx
// 로딩 상태 - aria-busy 패턴
<div aria-busy={isLoading} aria-live="polite">
  {isLoading && <LoadingSpinner />}
  {content}
</div>

// 아이콘 버튼 - aria-label 패턴
<button aria-label="카카오톡으로 문의하기">
  <KakaoIcon aria-hidden="true" />
</button>

// 에러 메시지 - role="alert" 패턴
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

---

## 5. 테이블 반응형 전략

### Decision
수평 스크롤 + 스크롤 힌트 UI 구현

### Rationale
- 관리자 테이블은 컬럼이 많아 카드 레이아웃 변환 시 정보 밀도 저하
- 수평 스크롤이 데이터 테이블에 적합한 표준 패턴
- 스크롤 가능 여부를 시각적으로 힌트 제공 (그라데이션 또는 화살표)

### Alternatives Considered
| 옵션 | 장점 | 단점 | 결정 |
|------|------|------|------|
| 카드 레이아웃 변환 | 모바일 친화적 | 정보 비교 어려움 | ❌ 기각 |
| 컬럼 숨기기 | 간단 | 정보 손실 | ❌ 기각 |
| 수평 스크롤 | 모든 데이터 유지 | 스크롤 인지 필요 | ✅ 채택 |

### Implementation Notes
```tsx
// 테이블 컨테이너 with 스크롤 힌트
<div className="relative">
  <div className="overflow-x-auto">
    <table className="min-w-[800px] w-full">...</table>
  </div>
  {/* 스크롤 힌트 그라데이션 */}
  <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
</div>
```

---

## 6. 접근성 테스트 전략

### Decision
axe-core 자동화 + 수동 스크린 리더 테스트 병행

### Rationale
- axe-core로 자동 검출 가능한 이슈 먼저 해결 (색상 대비, ARIA 속성 등)
- 수동 테스트로 키보드 흐름, 스크린 리더 경험 검증
- Playwright E2E 테스트에 axe 통합

### Implementation Notes
```typescript
// Playwright + axe-core 통합 테스트
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('접근성 검사 - 프로필 페이지', async ({ page }) => {
  await page.goto('/profile/kim-pro');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

## Summary

| 영역 | 결정 | 구현 복잡도 |
|------|------|-------------|
| 모바일 CTA | 스크롤 감지 + 최소화 | 중 |
| 포커스 트랩 | 커스텀 훅 | 중 |
| 디자인 토큰 | 브랜드 색상 분리 | 낮음 |
| 스크린 리더 | ARIA 표준 패턴 | 낮음 |
| 테이블 반응형 | 수평 스크롤 + 힌트 | 낮음 |
| 접근성 테스트 | axe-core + 수동 | 중 |

모든 결정사항은 기존 프로젝트 구조와 디자인 시스템을 최대한 활용하며, 외부 의존성 추가 없이 구현 가능.
