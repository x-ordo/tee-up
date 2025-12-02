# Quickstart: UX 접근성 및 디자인 일관성 개선

**Feature**: 001-ux-a11y-fixes
**Date**: 2025-12-02

이 문서는 각 User Story 완료 후 독립적으로 검증할 수 있는 테스트 시나리오를 제공합니다.

---

## 사전 준비

```bash
# 1. 개발 서버 시작
cd web && npm run dev

# 2. Playwright 테스트 환경 (선택)
npm run test:e2e:headed
```

---

## US1: 모바일 사용자 콘텐츠 접근성

### 수동 테스트

1. **브라우저 DevTools 모바일 뷰** (375px 너비)로 전환
2. `/profile/kim-pro` 접속 (또는 아무 프로 프로필)
3. 페이지 하단까지 스크롤

**확인 항목**:
- [ ] 플로팅 CTA 버튼이 콘텐츠를 10% 이상 가리지 않음
- [ ] 스크롤 중 CTA가 숨겨지거나 최소화됨
- [ ] 스크롤 멈춤 후 1초 내 CTA 재표시
- [ ] 320px 화면에서 CTA가 단일 아이콘 버튼으로 축소

### E2E 테스트 코드

```typescript
// e2e/accessibility.spec.ts
test('US1: 모바일 CTA 콘텐츠 가림 방지', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/profile/kim-pro');

  // 마지막 콘텐츠 섹션이 보이는지 확인
  const lastSection = page.locator('section').last();
  await expect(lastSection).toBeVisible();

  // CTA 버튼 존재 확인
  const ctaButton = page.locator('[data-testid="floating-cta"]');
  await expect(ctaButton).toBeVisible();
});
```

---

## US2: 키보드 사용자 전체 기능 접근

### 수동 테스트

1. 마우스 사용하지 않고 **Tab 키만으로** 탐색
2. 홈페이지 → 프로 디렉토리 → 프로 프로필 → 예약 모달 순서

**확인 항목**:
- [ ] 모든 링크/버튼에 포커스 시 시각적 표시 (파란색 링)
- [ ] 예약 모달 열면 포커스가 모달 내부로 이동
- [ ] 모달 내에서 Tab 순환 (마지막 요소 → 첫 요소)
- [ ] Escape 키로 모달 닫힘
- [ ] 모달 닫힌 후 포커스가 "예약하기" 버튼으로 복귀

### E2E 테스트 코드

```typescript
test('US2: 키보드 전체 흐름', async ({ page }) => {
  await page.goto('/');

  // Tab으로 첫 번째 프로 카드 링크까지 이동
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // 포커스된 요소가 outline 스타일 가짐
  const focusedElement = page.locator(':focus');
  await expect(focusedElement).toHaveCSS('outline-style', 'solid');
});

test('US2: 모달 포커스 트랩', async ({ page }) => {
  await page.goto('/profile/kim-pro');

  // 예약 버튼 클릭
  await page.click('button:has-text("레슨 문의")');

  // 모달 내 첫 요소에 포커스
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();

  // Escape로 닫기
  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
});
```

---

## US3: 디자인 시스템 일관성 유지

### 수동 테스트

1. 에러 페이지 확인 (존재하지 않는 URL 접속: `/nonexistent-page`)
2. 카카오톡 버튼이 있는 프로필 페이지 확인

**확인 항목**:
- [ ] 에러 페이지에서 하드코딩된 색상(#FEE2E2, #EF4444 등) 없음
- [ ] 카카오톡 버튼 색상이 `var(--brand-kakao)` 사용
- [ ] DevTools에서 `bg-[#...]` 패턴 검색 시 0개

### 코드 검증

```bash
# 하드코딩된 색상 검색 (0개여야 함)
cd web
grep -r "bg-\[#" src/app/ --include="*.tsx" | wc -l
# 예상 결과: 0

grep -r "text-\[#" src/app/ --include="*.tsx" | wc -l
# 예상 결과: 0
```

---

## US4: 스크린 리더 사용자 정보 접근

### 수동 테스트 (VoiceOver 또는 NVDA 필요)

1. **macOS**: Cmd + F5로 VoiceOver 활성화
2. 홈페이지 접속 후 Tab으로 탐색

**확인 항목**:
- [ ] 아이콘 전용 버튼에 설명 읽힘 ("카카오톡으로 문의하기" 등)
- [ ] 로딩 중일 때 "로딩 중" 알림
- [ ] 에러 발생 시 에러 메시지 자동 읽힘

### E2E 테스트 코드 (axe-core)

```typescript
import AxeBuilder from '@axe-core/playwright';

test('US4: 접근성 자동 검사', async ({ page }) => {
  await page.goto('/profile/kim-pro');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // critical 및 serious 오류 0개
  const criticalViolations = accessibilityScanResults.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );
  expect(criticalViolations).toHaveLength(0);
});
```

---

## US5: 관리자 테이블 모바일 접근성

### 수동 테스트

1. 모바일 뷰 (375px)에서 `/admin/chats` 접속
2. 테이블 영역 좌우 스와이프

**확인 항목**:
- [ ] 테이블 수평 스크롤 가능
- [ ] 스크롤 가능 힌트 (그라데이션 또는 화살표) 표시
- [ ] 모든 컬럼 접근 가능

### E2E 테스트 코드

```typescript
test('US5: 관리자 테이블 모바일 스크롤', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/admin/chats');

  // 테이블 컨테이너가 overflow-x-auto 스타일 가짐
  const tableContainer = page.locator('.table-container');
  await expect(tableContainer).toHaveCSS('overflow-x', 'auto');

  // 마지막 컬럼도 스크롤로 접근 가능
  const lastColumnHeader = page.locator('th').last();
  await lastColumnHeader.scrollIntoViewIfNeeded();
  await expect(lastColumnHeader).toBeVisible();
});
```

---

## 전체 검증 체크리스트

| US | 수동 테스트 | E2E 테스트 | axe-core |
|----|-------------|------------|----------|
| US1 | ⬜ | ⬜ | - |
| US2 | ⬜ | ⬜ | - |
| US3 | ⬜ | - | - |
| US4 | ⬜ | - | ⬜ |
| US5 | ⬜ | ⬜ | - |

**통과 기준**: 모든 항목 ✅ 체크 시 기능 완료

---

## 문제 해결

### 포커스 링이 안 보임
- `global.css`에서 `:focus-visible` 스타일 확인
- Tailwind의 `ring-*` 클래스 적용 여부 확인

### axe-core 오류
```bash
# axe 설치 확인
npm list @axe-core/playwright

# 없으면 설치
npm install -D @axe-core/playwright
```

### 모바일 뷰에서 CTA 여전히 가림
- `ProfileTemplate.tsx`의 media query 브레이크포인트 확인
- `fixed` 포지션 대신 조건부 렌더링 확인
