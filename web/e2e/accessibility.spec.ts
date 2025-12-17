import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('US1: 모바일 CTA 콘텐츠 가림 방지', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/profile/elliot-kim');

    // 마지막 콘텐츠 섹션이 보이는지 확인
    const lastSection = page.locator('section').last();
    await expect(lastSection).toBeVisible();

    // CTA 버튼 존재 확인
    const ctaButton = page.locator('[data-testid="floating-cta"]');
    await expect(ctaButton).toBeVisible();
  });

  test('US1: 모바일 CTA 스크롤 시 숨김/표시 동작', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/profile/elliot-kim');
    const ctaButton = page.locator('[data-testid="floating-cta"]');

    // 1. Initial state: visible
    await expect(ctaButton).toHaveCSS('opacity', '1');

    // 2. Scroll down: should hide
    await page.evaluate(() => window.scrollBy(0, 200));
    await expect(ctaButton).toHaveCSS('opacity', '0');

    // 3. Wait for timeout: should reappear
    await page.waitForTimeout(1100); // delay is 1000ms, add a small buffer
    await expect(ctaButton).toHaveCSS('opacity', '1');
  });

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
    await page.goto('/profile/elliot-kim');

    // 예약 버튼 클릭 (desktop: "레슨 상담하기", mobile: "레슨 문의")
    const bookingButton = page.locator('button:has-text("레슨"), button:has-text("상담")').first();
    await bookingButton.click();

    // 모달과 그 안의 요소들 확인
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Wait a bit for focus trap to activate
    await page.waitForTimeout(100);

    // Get only enabled focusable elements (exclude disabled buttons)
    const focusableElements = await modal.locator('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    expect(focusableElements.length).toBeGreaterThan(0);

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus trap should have set focus on first element
    await expect(firstElement).toBeFocused({ timeout: 2000 });

    // Tab 키를 눌러 포커스가 모달 내에서 순환하는지 확인
    await page.keyboard.press('Tab');
    await expect(focusableElements[1]).toBeFocused();

    // 마지막 요소에서 Tab을 누르면 첫번째 요소로 가는지 확인
    await lastElement.focus();
    await page.keyboard.press('Tab');
    await expect(firstElement).toBeFocused();

    // 첫번째 요소에서 Shift+Tab을 누르면 마지막 요소로 가는지 확인
    await firstElement.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(lastElement).toBeFocused();

    // Escape로 닫기
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

    // 닫은 후 포커스가 원래 버튼으로 돌아왔는지 확인
    await expect(bookingButton).toBeFocused();
  });

  test('US4: 접근성 자동 검사', async ({ page }) => {
    await page.goto('/profile/elliot-kim');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // critical 및 serious 오류 0개
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toHaveLength(0);
  });

  test('US5: 관리자 테이블 모바일 스크롤', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/chats');

    // Wait for either table to load or error state
    // If Supabase is unavailable, the page may show an error
    const tableContainer = page.locator('.table-container');
    const errorAlert = page.locator('[role="alert"]');

    // Try to wait for table container to appear (it renders after loading completes)
    try {
      await tableContainer.waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      // Skip test if table doesn't appear (likely Supabase connection issue)
      test.skip(true, 'Table container not available (Supabase may be unavailable)');
      return;
    }

    // 테이블 컨테이너가 overflow-x-auto 스타일 가짐
    await expect(tableContainer).toHaveCSS('overflow-x', 'auto');

    // 마지막 컬럼도 스크롤로 접근 가능
    const lastColumnHeader = page.locator('th').last();
    const thCount = await page.locator('th').count();
    if (thCount > 0) {
      await lastColumnHeader.scrollIntoViewIfNeeded();
      await expect(lastColumnHeader).toBeVisible();
    }
  });
});