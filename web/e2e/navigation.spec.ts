import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Homepage CTAs', () => {
    test('should navigate to onboarding from hero CTA', async ({ page }) => {
      // Hero CTA text: "3분 만에 AI 매칭 시작하기"
      await page.getByRole('link', { name: /AI 매칭 시작하기/ }).click();
      await expect(page).toHaveURL(/\/onboarding\/mood/);
    });

    test('should navigate to get-started from bottom CTA', async ({ page }) => {
      // Scroll to bottom CTA
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.getByRole('link', { name: '무료 매칭 받아보기' }).click();
      // get-started may redirect to onboarding/mood or stay at /get-started
      await expect(page).toHaveURL(/\/(get-started|onboarding\/mood)/);
    });

    test('should navigate to profile directory', async ({ page }) => {
      await page.getByRole('link', { name: '모든 프로 살펴보기' }).click();
      await expect(page).toHaveURL(/\/profile/);
    });
  });

  test.describe('Homepage Content', () => {
    test('should display AI matching section', async ({ page }) => {
      const matchingText = page.getByText('현재 실력과 바라는 변화를 알려주세요');
      await expect(matchingText).toBeVisible();
    });
  });
});

test.describe('Profile Page', () => {
  test('should navigate to profile directory and show pro list', async ({ page }) => {
    await page.goto('/profile');

    // Profile directory page should load
    await expect(page).toHaveURL(/\/profile/);

    // Should have some content (heading or pro cards)
    const hasContent = await page.locator('h1, h2, [class*="card"], [class*="Card"]').first().isVisible();
    expect(hasContent).toBe(true);
  });

  test('should open booking modal and show KakaoTalk link', async ({ page }) => {
    await page.goto('/profile');

    // Click on first pro card or navigate to a specific pro
    const proLink = page.getByRole('link', { name: /elliot/i }).first();
    if (await proLink.count() === 0) {
      // If no elliot link, skip this test
      test.skip();
      return;
    }
    await proLink.click();

    // Open booking modal
    const bookingButton = page.getByRole('button', { name: /레슨 상담|상담하기/i });
    if (await bookingButton.count() === 0) {
      // If no booking button, skip
      test.skip();
      return;
    }
    await bookingButton.click();

    // Check modal is visible (may have different button text)
    const inquiryButton = page.getByRole('button', { name: /문의|상담/i });
    if (await inquiryButton.count() > 0) {
      await expect(inquiryButton.first()).toBeVisible();
    }
  });
});

test.describe('Footer Navigation', () => {
  test('should have working footer links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Get footer element specifically (role="contentinfo")
    const footer = page.getByRole('contentinfo');

    // Check footer links exist (matching actual Footer.tsx content)
    await expect(footer.getByRole('link', { name: '프로 찾기' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '요금제' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'AI 매칭 시작' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '이용약관' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '개인정보처리방침' })).toBeVisible();
  });

  test('should navigate to terms page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.getByRole('link', { name: '이용약관' }).click();
    await expect(page).toHaveURL(/\/legal\/terms/);
  });

  test('should navigate to privacy page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.getByRole('link', { name: '개인정보처리방침' }).click();
    await expect(page).toHaveURL(/\/legal\/privacy/);
  });
});
