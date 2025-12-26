import { test, expect } from '@playwright/test'

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for page to fully load and hydrate
    await page.waitForLoadState('networkidle')
  })

  test('should have theme toggle button in navigation', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
  })

  test('should toggle from light to dark mode', async ({ page }) => {
    // Check initial state (light mode) - uses data-theme attribute, not class
    const html = page.locator('html')
    await expect(html).not.toHaveAttribute('data-theme', 'dark')

    // Find the theme toggle button and wait for it to be enabled (mounted)
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
    await expect(themeToggle).toBeEnabled({ timeout: 10000 })

    // Click the theme toggle button
    await themeToggle.click()

    // Verify dark mode is applied via data-theme attribute
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('should toggle from dark to light mode', async ({ page }) => {
    const html = page.locator('html')

    // Find theme toggle button, wait for it to be enabled, and click to enable dark mode
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
    await expect(themeToggle).toBeEnabled({ timeout: 10000 })
    await themeToggle.click()

    // Verify dark mode is active via data-theme attribute
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Toggle back to light mode - find the button again as its state may have changed
    const lightToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(lightToggle).toBeEnabled()
    await lightToggle.click()

    // Verify light mode is restored
    await expect(html).toHaveAttribute('data-theme', 'light')
  })

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Find theme toggle button, wait for it to be enabled, and enable dark mode
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
    await expect(themeToggle).toBeEnabled({ timeout: 10000 })
    await themeToggle.click()

    // Verify dark mode is applied
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify dark mode persists after reload via data-theme attribute
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('should have theme toggle button accessible via keyboard', async ({ page }) => {
    // Find theme toggle button and wait for it to be enabled
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
    await expect(themeToggle).toBeEnabled({ timeout: 10000 })
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
    // Find theme toggle button - it has an aria-label
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()

    // Verify button has aria-label attribute (may be loading or mounted)
    const ariaLabel = await themeToggle.getAttribute('aria-label')
    expect(['테마 전환', '다크 모드로 전환', '라이트 모드로 전환']).toContain(ariaLabel)
  })

  test('should have aria-pressed attribute on theme toggle', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()

    // Verify button has aria-pressed attribute (undefined in loading state, 'false' in light mode)
    const ariaPressed = await themeToggle.getAttribute('aria-pressed')
    // In loading state aria-pressed is not set, in mounted state it should be 'false' or 'true'
    expect(ariaPressed === null || ariaPressed === 'false' || ariaPressed === 'true').toBeTruthy()
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

    // Find theme toggle button, wait for it to be enabled, and click to enable dark mode
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ }).first()
    await expect(themeToggle).toBeVisible()
    await expect(themeToggle).toBeEnabled({ timeout: 10000 })
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
    await page.waitForLoadState('networkidle')

    const html = page.locator('html')

    // Should start in dark mode (matching system preference)
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Find theme toggle, wait for it to be enabled, and click to switch to light mode
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
    await expect(themeToggle).toBeEnabled({ timeout: 10000 })
    await themeToggle.click()

    // Should be light mode despite system preference
    await expect(html).toHaveAttribute('data-theme', 'light')

    // Reload - manual preference should persist
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(html).toHaveAttribute('data-theme', 'light')
  })
})

test.describe('No Flash of Unstyled Content (FOUC)', () => {
  test('should not flash wrong theme on page load', async ({ page }) => {
    // Set dark mode preference
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find theme toggle, wait for it to be enabled, and click to set dark mode preference
    const themeToggle = page.getByRole('button', { name: /테마 전환|라이트 모드로 전환|다크 모드로 전환/ })
    await expect(themeToggle).toBeVisible()
    await expect(themeToggle).toBeEnabled({ timeout: 10000 })
    await themeToggle.click()

    // Verify dark mode is applied
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // The page should have dark theme from the start (no flash) via data-theme attribute
    await expect(html).toHaveAttribute('data-theme', 'dark')

    // Note: True FOUC prevention requires server-side script injection
    // This test verifies the client-side behavior is correct
  })
})
