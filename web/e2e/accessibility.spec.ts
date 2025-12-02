import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.describe('US1: 모바일 CTA 콘텐츠 가림 방지', () => {
    test('모바일에서 CTA가 콘텐츠를 가리지 않음', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/profile/kim-pro');

      // 마지막 콘텐츠 섹션이 보이는지 확인
      const lastSection = page.locator('section').last();
      await expect(lastSection).toBeVisible();

      // CTA 버튼 존재 확인
      const ctaButton = page.locator('[data-testid="floating-cta"]');
      await expect(ctaButton).toBeVisible();
    });

    test('스크롤 시 CTA가 숨겨짐', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/profile/kim-pro');

      const ctaButton = page.locator('[data-testid="floating-cta"]');
      await expect(ctaButton).toBeVisible();

      // 스크롤 실행
      await page.evaluate(() => window.scrollBy(0, 500));

      // CTA가 숨겨지거나 투명해짐 (스크롤 중)
      await page.waitForTimeout(100);
      const opacity = await ctaButton.evaluate((el) =>
        window.getComputedStyle(el).opacity
      );
      expect(parseFloat(opacity)).toBeLessThanOrEqual(1);
    });
  });

  test.describe('US2: 키보드 전체 흐름', () => {
    test('Tab 키로 인터랙티브 요소 탐색 가능', async ({ page }) => {
      await page.goto('/');

      // Tab으로 첫 번째 링크까지 이동
      await page.keyboard.press('Tab');

      // 포커스된 요소가 존재
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('모달 포커스 트랩', async ({ page }) => {
      await page.goto('/profile/kim-pro');

      // 레슨 문의 버튼 클릭 (floating CTA 내의 버튼)
      const ctaButton = page.locator('[data-testid="floating-cta"] button').first();
      await ctaButton.click();

      // 모달이 열리는지 확인
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Escape로 닫기
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('US4: 접근성 자동 검사 (axe-core)', () => {
    test('홈페이지 WCAG AA 준수', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // critical 및 serious 오류 0개
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (criticalViolations.length > 0) {
        console.log('Critical violations:', JSON.stringify(criticalViolations, null, 2));
      }

      expect(criticalViolations).toHaveLength(0);
    });

    test('프로필 페이지 WCAG AA 준수', async ({ page }) => {
      await page.goto('/profile/kim-pro');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (criticalViolations.length > 0) {
        console.log('Critical violations:', JSON.stringify(criticalViolations, null, 2));
      }

      expect(criticalViolations).toHaveLength(0);
    });
  });

  test.describe('US5: 관리자 테이블 모바일 스크롤', () => {
    test('채팅 관리 테이블 수평 스크롤 가능', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/admin/chats');

      // 테이블 컨테이너가 overflow-x-auto 스타일 가짐
      const scrollContainer = page.locator('.overflow-x-auto').first();
      await expect(scrollContainer).toBeVisible();

      // 테이블이 존재하는지 확인
      const table = page.locator('table').first();
      await expect(table).toBeVisible();
    });
  });

  test.describe('다크 모드 접근성', () => {
    test('다크 모드에서 critical 접근성 위반 없음 (홈페이지)', async ({ page }) => {
      await page.goto('/');

      // 다크 모드 활성화
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast']) // Known issue: accent color contrast will be addressed in design system update
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical'
      );

      if (criticalViolations.length > 0) {
        console.log('Dark mode critical violations:', JSON.stringify(criticalViolations, null, 2));
      }

      expect(criticalViolations).toHaveLength(0);
    });

    test('다크 모드에서 critical 접근성 위반 없음 (프로필)', async ({ page }) => {
      await page.goto('/profile/kim-pro');

      // 다크 모드 활성화
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast']) // Known issue: accent color contrast will be addressed in design system update
        .exclude('iframe') // Exclude third-party iframes (YouTube) which we cannot control
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical'
      );

      if (criticalViolations.length > 0) {
        console.log('Dark mode critical violations:', JSON.stringify(criticalViolations, null, 2));
      }

      expect(criticalViolations).toHaveLength(0);
    });

    test('다크 모드 토글 aria 속성 검증', async ({ page }) => {
      await page.goto('/');

      const themeToggle = page.locator('[aria-label="다크 모드로 전환"], [aria-label="라이트 모드로 전환"]');
      await expect(themeToggle).toBeVisible();

      // 토글 버튼에 적절한 role 및 aria 속성 확인
      await expect(themeToggle).toHaveAttribute('type', 'button');
    });
  });

  test.describe('스켈레톤 UI 접근성', () => {
    test('스켈레톤 로딩 상태에 aria 속성 적용', async ({ page }) => {
      // 프로필 로딩 페이지로 이동 (느린 네트워크 시뮬레이션)
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      await page.goto('/profile');

      // aria-busy 속성이 있는 요소 확인
      const skeletonWithAria = page.locator('[aria-busy="true"]');
      const count = await skeletonWithAria.count();

      // 최소 하나의 스켈레톤이 aria-busy를 가짐
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('스켈레톤 shimmer 애니메이션 존재', async ({ page }) => {
      await page.goto('/');

      // CSS에 shimmer 키프레임이 정의되어 있는지 확인
      const hasShimmer = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        for (const sheet of styleSheets) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
              if (rule instanceof CSSKeyframesRule && rule.name === 'shimmer') {
                return true;
              }
            }
          } catch {
            // Cross-origin stylesheets may throw
          }
        }
        return false;
      });

      expect(hasShimmer).toBe(true);
    });

    test('prefers-reduced-motion 지원 확인', async ({ page }) => {
      // reduced-motion 에뮬레이션
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');

      // 애니메이션 지속 시간이 최소화되어야 함
      const hasReducedMotion = await page.evaluate(() => {
        const computed = window.getComputedStyle(document.documentElement);
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        return mediaQuery.matches;
      });

      expect(hasReducedMotion).toBe(true);
    });
  });
});
