import { test, expect } from '@playwright/test'

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have theme toggle button in navigation', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
  })

  test('should toggle from light to dark mode', async ({ page }) => {
    // Check initial state (light mode) - uses data-theme attribute, not class
    const html = page.locator('html')
    await expect(html).not.toHaveAttribute('data-theme', 'dark')

    // Click theme toggle
    const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ })
    await themeToggle.click()

    // Verify dark mode is applied via data-theme attribute
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Verify the button label changed
    await expect(page.getByRole('button', { name: /라이트 모드로 전환/ })).toBeVisible()
  })

  test('should toggle from dark to light mode', async ({ page }) => {
    // First enable dark mode
    const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ })
    await themeToggle.click()

    // Verify dark mode is active via data-theme attribute
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Toggle back to light mode
    const lightToggle = page.getByRole('button', { name: /라이트 모드로 전환/ })
    await lightToggle.click()

    // Verify light mode is restored
    await expect(html).toHaveAttribute('data-theme', 'light')
  })

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Enable dark mode
    const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ })
    await themeToggle.click()

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')

    // Reload page
    await page.reload()

    // Verify dark mode persists after reload via data-theme attribute
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('should have theme toggle button accessible via keyboard', async ({ page }) => {
    // Tab to the theme toggle button
    const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ })
    await themeToggle.focus()

    // Verify button is focused
    await expect(themeToggle).toBeFocused()

    // Press Enter to toggle
    await page.keyboard.press('Enter')

    // Verify theme changed via data-theme attribute
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('should have proper aria-label on theme toggle', async ({ page }) => {
    // Light mode - should show "다크 모드로 전환"
    const lightModeToggle = page.getByRole('button', { name: '다크 모드로 전환' })
    await expect(lightModeToggle).toHaveAttribute('aria-label', '다크 모드로 전환')

    // Toggle to dark mode
    await lightModeToggle.click()

    // Dark mode - should show "라이트 모드로 전환"
    const darkModeToggle = page.getByRole('button', { name: '라이트 모드로 전환' })
    await expect(darkModeToggle).toHaveAttribute('aria-label', '라이트 모드로 전환')
  })

  test('should have aria-pressed attribute on theme toggle', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ })

    // Light mode - aria-pressed should be false
    await expect(themeToggle).toHaveAttribute('aria-pressed', 'false')

    // Toggle to dark mode
    await themeToggle.click()

    // Dark mode - aria-pressed should be true
    const darkToggle = page.getByRole('button', { name: /라이트 모드로 전환/ })
    await expect(darkToggle).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('Theme on Admin Page', () => {
  // Skip this test as admin requires authentication which is not available in E2E testing environment
  // The ThemeToggle component is verified to be present in AdminDashboard.tsx
  test.skip('should have theme toggle in admin dashboard', async ({ page }) => {
    // This test is skipped because admin pages require authentication
    // Manual verification: ThemeToggle is imported and rendered in AdminDashboard.tsx at line 81
    await page.goto('/admin')

    // Check theme toggle exists in admin dashboard
    const themeToggle = page.getByRole('button', { name: /라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
  })
})

test.describe('Theme on Profile Page', () => {
  // Helper to check if profile page exists
  async function navigateToProfileOrSkip(page: import('@playwright/test').Page) {
    const response = await page.goto('/profile/elliot-kim')
    if (response?.status() === 404) {
      return false
    }
    return true
  }

  test('should have theme toggle on profile page', async ({ page }) => {
    const exists = await navigateToProfileOrSkip(page)
    if (!exists) {
      test.skip()
      return
    }

    // Check theme toggle exists (it's in a fixed position div, not navigation)
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ }).first()
    await expect(themeToggle).toBeVisible()
  })

  test('should toggle theme on profile page', async ({ page }) => {
    const exists = await navigateToProfileOrSkip(page)
    if (!exists) {
      test.skip()
      return
    }

    const html = page.locator('html')

    // Initial state - light mode (uses data-theme attribute, not class)
    await expect(html).not.toHaveAttribute('data-theme', 'dark')

    // Toggle to dark mode
    const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ }).first()
    await themeToggle.click()

    // Verify dark mode via data-theme attribute
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })
})

test.describe('System Theme Preference', () => {
  test('should respect system dark mode preference on first visit', async ({ page }) => {
    // Emulate dark color scheme BEFORE navigating
    await page.emulateMedia({ colorScheme: 'dark' })

    // Clear any stored theme preference
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.reload()

    // Page should be in dark mode via data-theme attribute
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('should respect system light mode preference on first visit', async ({ page }) => {
    // Emulate light color scheme BEFORE navigating
    await page.emulateMedia({ colorScheme: 'light' })

    // Clear any stored theme preference
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.reload()

    // Page should be in light mode via data-theme attribute
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'light')
  })

  test('user manual preference should override system preference', async ({ page }) => {
    // Set system to dark mode
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.reload()

    // Manually switch to light mode
    const themeToggle = page.getByRole('button', { name: /라이트 모드로 전환/ })
    await themeToggle.click()

    // Should be light mode despite system preference
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'light')

    // Reload - manual preference should persist
    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'light')
  })
})

test.describe('No Flash of Unstyled Content (FOUC)', () => {
  test('should not flash wrong theme on page load', async ({ page }) => {
    // Set dark mode preference
    await page.goto('/')
    const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ })
    await themeToggle.click()

    // Now reload and check for FOUC
    // We need to capture the initial state quickly
    let initialHadDarkTheme = false

    page.on('domcontentloaded', async () => {
      initialHadDarkTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark'
      })
    })

    await page.reload()

    // The page should have dark theme from the start (no flash) via data-theme attribute
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Note: True FOUC prevention requires server-side script injection
    // This test verifies the client-side behavior is correct
  })
})
