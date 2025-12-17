import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Homepage CTAs', () => {
    test('should navigate to onboarding from hero CTA', async ({ page }) => {
      await page.getByRole('link', { name: /AI 매칭 시작하기/ }).click();
      await expect(page).toHaveURL(/\/onboarding\/mood/);
    });

    test('should navigate to get-started from bottom CTA', async ({ page }) => {
      await page.getByRole('link', { name: '무료 매칭 받아보기' }).click();
      // get-started redirects to onboarding/mood
      await expect(page).toHaveURL(/\/onboarding\/mood/);
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
  test('should open booking modal and show KakaoTalk link', async ({ page }) => {
    await page.goto('/profile');

    // Click on first pro card or navigate to a specific pro
    await page.getByRole('link', { name: /elliot/i }).first().click();

    // Open booking modal
    await page.getByRole('button', { name: /레슨 상담하기/ }).click();

    // Check modal is visible
    await expect(page.getByRole('button', { name: '레슨 문의하기' })).toBeVisible();

    // Click to inquire
    await page.getByRole('button', { name: '레슨 문의하기' }).click();

    // KakaoTalk link should be visible
    const kakaoLink = page.getByRole('link', { name: /카카오톡으로.*문의/ });
    await expect(kakaoLink).toBeVisible();
  });
});

test.describe('Footer Navigation', () => {
  test('should have working footer links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check footer links exist (matching actual Footer.tsx content)
    await expect(page.getByRole('link', { name: '프로 찾기' })).toBeVisible();
    await expect(page.getByRole('link', { name: '요금제' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'AI 매칭 시작' })).toBeVisible();
    await expect(page.getByRole('link', { name: '이용약관' })).toBeVisible();
    await expect(page.getByRole('link', { name: '개인정보처리방침' })).toBeVisible();
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
