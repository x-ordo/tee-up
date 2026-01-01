# UI/UX 검증 및 업그레이드 전략

> TEE:UP 프로젝트의 디자인 의도 일관성 확보를 위한 종합 전략 문서

---

## 1. 현황 분석

### 1.1 디자인 시스템 정의 현황

**공식 디자인 시스템** (`web/src/app/global.css`)

| 구분 | 토큰명 | 값 | 용도 |
|------|--------|-----|------|
| 배경 | `--tee-background` | `#F7F4F0` | 페이지 배경 |
| 카드 | `--tee-surface` | `#FFFFFF` | 카드/섹션 배경 |
| 보더 | `--tee-stone` | `#E8E8E5` | 구분선, 테두리 |
| 보조텍스트 | `--tee-ink-muted` | `#5E5E5A` | 라벨, 보조 텍스트 |
| 본문텍스트 | `--tee-ink-light` | `#52524E` | 본문 텍스트 |
| 헤딩 | `--tee-ink-strong` | `#1A1A1A` | 제목, 강조 |
| **악센트(Primary)** | `--tee-accent-primary` | `#0A362B` | **Deep Green** |
| 악센트(Secondary) | `--tee-accent-secondary` | `#B39A68` | **Matte Gold** |
| 악센트 호버 | `--tee-accent-primary-hover` | `#072A21` | 호버/포커스 |
| 악센트 액티브 | `--tee-accent-primary-active` | `#051E18` | 클릭/활성 |

**디자인 철학**: Korean Luxury Minimalism (차분한 통제)
- 90% Neutrals + Deep Green Primary / Gold Secondary
- Light Theme 기반
- "Show, Don't Tell" 원칙

---

### 1.2 발견된 디자인 불일치

#### Critical: 두 가지 다른 디자인 테마 혼재

```
공식 시스템:  Light Theme + Deep Green (#0A362B) + Matte Gold (#B39A68)
문제 컴포넌트: Hard-coded Dark Theme + non-token Gold/Black values
```

| 파일 | 문제점 | 심각도 |
|------|--------|--------|
| `BookingModal.tsx` | `--lux-gold`, `--lux-carbon` (미정의 변수), gold gradient 버튼 | **HIGH** |
| `LoadingSpinner.tsx` | `#d4af37` (gold), dark gradient `#0a0e27` 배경 | **HIGH** |
| `StatCard.tsx` | `#d4af37` 기본 accent, gold gradient 버튼 | **HIGH** |
| `MessageBubble.tsx` | gold gradient 메시지, dark 배경 `#0a0e27` | **HIGH** |

#### 하드코딩된 색상 목록

```css
/* 제거 대상 (하드코딩 금지) */
#d4af37, #f4d9b0, #c0a36b, #f4e5c2  /* Gold variants (use --tee-accent-secondary) */
#0a0e27, #1a1f3a, #20190f           /* Dark backgrounds */

/* 미정의 CSS 변수 (제거 필요) */
--lux-gold, --lux-carbon, --lux-rose
```

---

## 2. 검증 체계

### 2.1 1단계: Design Audit (디자인 감사)

#### A. 자동화된 색상 스캔

```bash
# 하드코딩된 색상 검출
grep -rn "#d4af37\|#f4d9b0\|#c0a36b\|#0a0e27\|#1a1f3a" web/src/

# 미정의 CSS 변수 검출
grep -rn "var(--lux-" web/src/
```

#### B. 컴포넌트별 체크리스트

- [ ] `BookingModal.tsx` - 디자인 토큰 적용
- [ ] `LoadingSpinner.tsx` - 라이트 테마 전환
- [ ] `StatCard.tsx` - tee-accent-primary 적용
- [ ] `MessageBubble.tsx` - 공식 message-bubble 클래스 사용

#### C. 토큰 사용률 측정

```bash
# CSS 변수 사용 현황
grep -roh "var(--tee-[^)]*)" web/src/ | sort | uniq -c | sort -rn
```

---

### 2.2 2단계: Design Linting (자동 검증)

#### Stylelint 설정 (신규)

```javascript
// web/.stylelintrc.js
module.exports = {
  rules: {
    // 하드코딩 색상 금지
    'color-no-hex': true,

    // 허용된 CSS 변수만 사용
    'declaration-property-value-allowed-list': {
  'color': ['/^var\\(--tee-/', '/^transparent/', '/^inherit/'],
  'background': ['/^var\\(--tee-/', '/^transparent/', '/^linear-gradient/'],
  'background-color': ['/^var\\(--tee-/', '/^transparent/'],
  'border-color': ['/^var\\(--tee-/', '/^transparent/'],
    },
  }
};
```

#### ESLint 플러그인 (Tailwind 클래스 검증)

```javascript
// eslint-plugin-design-system (커스텀)
// 금지된 색상 클래스 탐지
const forbiddenColors = ['bg-\\[#', 'text-\\[#', 'border-\\[#'];
```

---

### 2.3 3단계: Visual Regression Testing

#### Playwright 스냅샷 테스트

```typescript
// web/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'profile', path: '/profile/kim-pro' },
  { name: 'admin-dashboard', path: '/admin' },
  { name: 'admin-pros', path: '/admin/pros' },
];

for (const page of pages) {
  test(`visual: ${page.name}`, async ({ page: p }) => {
    await p.goto(page.path);
    await expect(p).toHaveScreenshot(`${page.name}.png`, {
      maxDiffPixelRatio: 0.01,
    });
  });
}
```

#### 컴포넌트별 스냅샷

```typescript
// 주요 컴포넌트 상태별 스냅샷
test('BookingModal states', async ({ page }) => {
  // default, loading, error, success 상태별 캡처
});
```

---

### 2.4 4단계: Storybook 도입

#### 설치 및 설정

```bash
cd web
npx storybook@latest init
```

#### 컴포넌트 스토리 구조

```
web/
├── src/
│   └── stories/
│       ├── foundation/
│       │   ├── Colors.stories.tsx
│       │   ├── Typography.stories.tsx
│       │   └── Spacing.stories.tsx
│       ├── components/
│       │   ├── Button.stories.tsx
│       │   ├── Card.stories.tsx
│       │   ├── Modal.stories.tsx
│       │   └── ...
│       └── pages/
│           ├── Homepage.stories.tsx
│           └── Profile.stories.tsx
```

#### 디자인 토큰 문서화

```typescript
// Colors.stories.tsx
export const ColorPalette = () => (
  <div className="grid grid-cols-4 gap-4">
    {Object.entries(colors).map(([name, value]) => (
      <div key={name} className="p-4" style={{ background: value }}>
        <p className="text-sm font-mono">{name}</p>
        <p className="text-xs">{value}</p>
      </div>
    ))}
  </div>
);
```

---

## 3. 업그레이드 로드맵

### Phase 1: 즉시 수정 (1-2일)

```
목표: 디자인 시스템 불일치 제거
```

| 작업 | 파일 | 변경 내용 |
|------|------|----------|
| 1.1 | `BookingModal.tsx` | light theme + tee-accent-primary 전환 |
| 1.2 | `LoadingSpinner.tsx` | tee-background 배경, tee-accent-primary 스피너 |
| 1.3 | `StatCard.tsx` | tee-accent-primary 기본값 적용 |
| 1.4 | `MessageBubble.tsx` | message-bubble 클래스 사용 |

**검증 방법:**
- 수동 UI 확인
- 기존 E2E 테스트 통과

---

### Phase 2: 자동화 도구 구축 (3-5일)

```
목표: 디자인 일탈 자동 탐지
```

| 작업 | 도구 | 설명 |
|------|------|------|
| 2.1 | Stylelint | 하드코딩 색상 금지 규칙 |
| 2.2 | ESLint 규칙 | Tailwind 임의값 사용 경고 |
| 2.3 | pre-commit hook | 커밋 전 디자인 검증 |
| 2.4 | CI 통합 | PR마다 디자인 검사 실행 |

**검증 방법:**
- CI 파이프라인에서 lint 실패 시 PR 블록

---

### Phase 3: Visual Regression 구축 (5-7일)

```
목표: 시각적 변경 자동 추적
```

| 작업 | 도구 | 설명 |
|------|------|------|
| 3.1 | Playwright 스냅샷 | 페이지별 기준 이미지 생성 |
| 3.2 | 컴포넌트 스냅샷 | 상태별 UI 캡처 |
| 3.3 | 리포트 생성 | 변경 전후 비교 HTML |
| 3.4 | CI 통합 | PR 코멘트로 diff 리포트 |

**검증 방법:**
- 스냅샷 diff > 1% 시 경고
- 의도적 변경 시 스냅샷 업데이트 승인

---

### Phase 4: Storybook 문서화 (7-10일)

```
목표: 살아있는 디자인 문서
```

| 작업 | 내용 |
|------|------|
| 4.1 | Foundation 스토리 | Colors, Typography, Spacing |
| 4.2 | 컴포넌트 스토리 | 모든 공유 컴포넌트 |
| 4.3 | 페이지 스토리 | 주요 페이지 템플릿 |
| 4.4 | Chromatic 연동 | 클라우드 호스팅 + 리뷰 |

**검증 방법:**
- Storybook 빌드 성공
- Chromatic 리뷰 워크플로우

---

## 4. CI/CD 통합 계획

### GitHub Actions 워크플로우

```yaml
# .github/workflows/design-validation.yml
name: Design Validation

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: cd web && npm ci
      - name: Stylelint
        run: cd web && npm run lint:styles
      - name: ESLint (design rules)
        run: cd web && npm run lint

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: cd web && npm ci
      - name: Install Playwright
        run: cd web && npx playwright install --with-deps
      - name: Run visual tests
        run: cd web && npm run test:visual
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: visual-report
          path: web/test-results/
```

---

## 5. 성공 지표

### 정량적 지표

| 지표 | 현재 | 목표 |
|------|------|------|
| 디자인 토큰 사용률 | ~60% | 95%+ |
| 하드코딩 색상 수 | 20+ | 0 |
| 미정의 변수 사용 | 4개 | 0 |
| Visual Regression 커버리지 | 0% | 80%+ |
| Storybook 컴포넌트 수 | 0 | 20+ |

### 정성적 지표

- [ ] 디자인 시스템 문서를 보고 신규 개발자가 즉시 작업 가능
- [ ] PR에서 디자인 변경 시 자동으로 시각적 diff 확인 가능
- [ ] 비개발자(디자이너)가 Storybook에서 컴포넌트 상태 확인 가능

---

## 6. 즉시 실행 가능한 액션

### 오늘 할 일

```bash
# 1. 하드코딩 색상 현황 파악
grep -rn "#d4af37\|#f4d9b0\|#c0a36b\|#0a0e27" web/src/ --include="*.tsx"

# 2. 미정의 변수 사용처 확인
grep -rn "var(--lux-" web/src/ --include="*.tsx"

# 3. 디자인 토큰 사용률 체크
grep -roh "var(--tee-[^)]*)" web/src/ | wc -l
```

### 권장 우선순위

1. **즉시**: `BookingModal.tsx`, `LoadingSpinner.tsx` 수정 (사용자 대면 컴포넌트)
2. **이번 주**: `StatCard.tsx`, `MessageBubble.tsx` 수정
3. **다음 주**: Stylelint 규칙 추가
4. **2주 내**: Visual Regression 테스트 추가
5. **1개월 내**: Storybook 구축

---

## 7. 참고 자료

### 프로젝트 내 문서

- `web/src/app/global.css` - 디자인 토큰 정의
- `web/tailwind.config.ts` - Tailwind 확장 설정
- `CLAUDE.md` - 프로젝트 가이드라인

### 외부 도구

- [Stylelint](https://stylelint.io/) - CSS 린팅
- [Playwright](https://playwright.dev/) - E2E + Visual Testing
- [Storybook](https://storybook.js.org/) - 컴포넌트 문서화
- [Chromatic](https://www.chromatic.com/) - Visual Regression 클라우드

---

## 변경 이력

| 날짜 | 버전 | 작성자 | 내용 |
|------|------|--------|------|
| 2025-11-27 | 1.0 | Claude | 초안 작성 |
