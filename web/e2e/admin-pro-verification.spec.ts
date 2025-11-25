import { test, expect } from '@playwright/test'

/**
 * Admin Pro Verification E2E Tests
 *
 * Prerequisites:
 * 1. Development server running (npm run dev)
 * 2. Supabase environment variables configured
 * 3. Admin account created in Supabase
 * 4. Test pro profiles in database with is_approved = false
 */

test.describe('Admin Pro Verification Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login page
    await page.goto('/admin/login')
  })

  test('should display login page', async ({ page }) => {
    // Check login page elements
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    // Try to access admin dashboard without login
    await page.goto('/admin')

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test.describe('Admin Login', () => {
    test('should show error for invalid credentials', async ({ page }) => {
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')

      // Should show error message
      await expect(page.locator('text=/error|invalid|failed/i')).toBeVisible({ timeout: 5000 })
    })

    test('should login successfully with valid credentials', async ({ page }) => {
      // TODO: Replace with actual admin credentials from .env.test
      const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@teeup.com'
      const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'password'

      await page.fill('input[type="email"]', adminEmail)
      await page.fill('input[type="password"]', adminPassword)
      await page.click('button[type="submit"]')

      // Should redirect to admin dashboard
      await expect(page).toHaveURL(/\/admin/, { timeout: 10000 })
    })
  })

  test.describe('Pro Verification (Authenticated)', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@teeup.com'
      const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'password'

      await page.fill('input[type="email"]', adminEmail)
      await page.fill('input[type="password"]', adminPassword)
      await page.click('button[type="submit"]')

      // Wait for redirect to dashboard
      await page.waitForURL(/\/admin/, { timeout: 10000 })
    })

    test('should navigate to pros page', async ({ page }) => {
      // Click on "프로 관리" menu item
      await page.click('text=프로 관리')

      // Should be on pros page
      await expect(page).toHaveURL(/\/admin\/pros/)
      await expect(page.locator('h1:has-text("프로 관리")')).toBeVisible()
    })

    test('should display pending pros', async ({ page }) => {
      await page.goto('/admin/pros')

      // Check for pending pros section
      await expect(page.locator('text=/승인 대기 중/i')).toBeVisible()

      // Should show pending pro cards or empty state
      const hasPendingPros = await page.locator('[data-testid="pending-pro-card"]').count() > 0
      const hasEmptyState = await page.locator('text=/대기 중인 신청이 없습니다/i').isVisible()

      expect(hasPendingPros || hasEmptyState).toBeTruthy()
    })

    test('should approve a pending pro', async ({ page }) => {
      await page.goto('/admin/pros')

      // Find first pending pro card
      const firstPendingCard = page.locator('[data-testid="pending-pro-card"]').first()

      // Skip if no pending pros
      const count = await page.locator('[data-testid="pending-pro-card"]').count()
      test.skip(count === 0, 'No pending pros available')

      // Get pro name before approval
      const proName = await firstPendingCard.locator('h3').textContent()

      // Click approve button
      await firstPendingCard.locator('button:has-text("승인")').click()

      // Wait for processing
      await page.waitForTimeout(1000)

      // Pro should move to approved table
      await expect(page.locator('.approved-pros-table')).toContainText(proName || '', { timeout: 5000 })

      // Should be removed from pending list
      const newCount = await page.locator('[data-testid="pending-pro-card"]').count()
      expect(newCount).toBe(count - 1)
    })

    test('should reject a pending pro with reason', async ({ page }) => {
      await page.goto('/admin/pros')

      // Find first pending pro card
      const firstPendingCard = page.locator('[data-testid="pending-pro-card"]').first()

      // Skip if no pending pros
      const count = await page.locator('[data-testid="pending-pro-card"]').count()
      test.skip(count === 0, 'No pending pros available')

      // Click reject button
      await firstPendingCard.locator('button:has-text("거부")').click()

      // Handle browser prompt for rejection reason
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt')
        await dialog.accept('자격증 확인 불가')
      })

      // Wait for processing
      await page.waitForTimeout(1000)

      // Should be removed from pending list
      const newCount = await page.locator('[data-testid="pending-pro-card"]').count()
      expect(newCount).toBe(count - 1)
    })

    test('should display approved pros table', async ({ page }) => {
      await page.goto('/admin/pros')

      // Check for approved pros section
      await expect(page.locator('text=/승인된 프로/i')).toBeVisible()

      // Should show table headers
      await expect(page.locator('th:has-text("이름")')).toBeVisible()
      await expect(page.locator('th:has-text("직함")')).toBeVisible()
      await expect(page.locator('th:has-text("조회수")')).toBeVisible()
      await expect(page.locator('th:has-text("Leads")')).toBeVisible()
      await expect(page.locator('th:has-text("매칭")')).toBeVisible()
      await expect(page.locator('th:has-text("평점")')).toBeVisible()
    })

    test('should navigate to pro management page', async ({ page }) => {
      await page.goto('/admin/pros')

      // Find first "관리" link in approved table
      const manageLink = page.locator('.approved-pros-table a:has-text("관리")').first()

      // Skip if no approved pros
      const count = await page.locator('.approved-pros-table a:has-text("관리")').count()
      test.skip(count === 0, 'No approved pros available')

      // Click manage link
      await manageLink.click()

      // Should navigate to individual pro management page
      await expect(page).toHaveURL(/\/admin\/pros\/[^/]+/, { timeout: 5000 })
    })
  })

  test.describe('Mobile Responsive', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should display mobile layout', async ({ page }) => {
      const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@teeup.com'
      const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'password'

      await page.fill('input[type="email"]', adminEmail)
      await page.fill('input[type="password"]', adminPassword)
      await page.click('button[type="submit"]')

      await page.waitForURL(/\/admin/, { timeout: 10000 })
      await page.goto('/admin/pros')

      // Check that pending pro cards stack vertically
      const cards = page.locator('[data-testid="pending-pro-card"]')
      const count = await cards.count()

      if (count > 1) {
        const firstCard = cards.nth(0)
        const secondCard = cards.nth(1)

        const firstBox = await firstCard.boundingBox()
        const secondBox = await secondCard.boundingBox()

        // Second card should be below first card (not side by side)
        if (firstBox && secondBox) {
          expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10)
        }
      }
    })
  })
})
