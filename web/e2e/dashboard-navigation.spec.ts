import { test, expect } from '@playwright/test'

/**
 * Dashboard Navigation E2E Tests
 * User Story 1: Dashboard Navigation Consistency
 *
 * Tests sidebar navigation, active states, breadcrumbs, and mobile menu
 *
 * NOTE: These tests require authentication.
 * To run these tests properly, set up auth fixtures with a valid session.
 *
 * SKIPPED: All tests in this file require authentication which is not available
 * in the current E2E testing environment. Enable when auth fixtures are set up.
 */

// Skip all dashboard navigation tests until auth fixtures are available
test.describe.skip('Dashboard Navigation', () => {
  test.describe('Desktop Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to desktop size
      await page.setViewportSize({ width: 1280, height: 800 })
    })

    test('should display sidebar navigation on desktop', async ({ page }) => {
      await page.goto('/dashboard')

      // Sidebar should be visible on desktop
      const sidebar = page.locator('[data-testid="sidebar"]')
      await expect(sidebar).toBeVisible()

      // Navigation items should be visible
      await expect(page.getByRole('link', { name: /대시보드/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /포트폴리오/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /리드|leads/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /설정/i })).toBeVisible()
    })

    test('should highlight active navigation item', async ({ page }) => {
      await page.goto('/dashboard')

      // Dashboard link should be active
      const dashboardLink = page.locator('[data-testid="sidebar"] a[href="/dashboard"]')
      await expect(dashboardLink).toHaveAttribute('data-active', 'true')

      // Navigate to portfolio
      await page.goto('/dashboard/portfolio')
      const portfolioLink = page.locator('[data-testid="sidebar"] a[href="/dashboard/portfolio"]')
      await expect(portfolioLink).toHaveAttribute('data-active', 'true')
    })

    test('should navigate between dashboard sections', async ({ page }) => {
      await page.goto('/dashboard')

      // Click portfolio link
      await page.getByRole('link', { name: /포트폴리오/i }).click()
      await expect(page).toHaveURL(/\/dashboard\/portfolio/)

      // Click leads link
      await page.getByRole('link', { name: /리드|leads/i }).click()
      await expect(page).toHaveURL(/\/dashboard\/leads/)

      // Click settings link
      await page.getByRole('link', { name: /설정/i }).click()
      await expect(page).toHaveURL(/\/dashboard\/settings/)

      // Click dashboard link to go back
      await page.getByRole('link', { name: /대시보드/i }).first().click()
      await expect(page).toHaveURL(/\/dashboard$/)
    })

    test('should display breadcrumbs on subpages', async ({ page }) => {
      await page.goto('/dashboard/portfolio')

      // Breadcrumbs should show current location
      const breadcrumbs = page.locator('[data-testid="breadcrumbs"]')
      await expect(breadcrumbs).toBeVisible()
      await expect(breadcrumbs.getByText(/대시보드/i)).toBeVisible()
      await expect(breadcrumbs.getByText(/포트폴리오/i)).toBeVisible()
    })

    test('should display user info in header', async ({ page }) => {
      await page.goto('/dashboard')

      // Header should show user menu
      const header = page.locator('[data-testid="dashboard-header"]')
      await expect(header).toBeVisible()

      // User menu button should be visible
      await expect(page.getByRole('button', { name: /사용자 메뉴|user menu/i })).toBeVisible()
    })
  })

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('should hide sidebar on mobile', async ({ page }) => {
      await page.goto('/dashboard')

      // Sidebar should be hidden on mobile
      const sidebar = page.locator('[data-testid="sidebar"]')
      await expect(sidebar).not.toBeVisible()
    })

    test('should show mobile menu button', async ({ page }) => {
      await page.goto('/dashboard')

      // Mobile menu button should be visible
      const menuButton = page.getByRole('button', { name: /메뉴|menu/i })
      await expect(menuButton).toBeVisible()
    })

    test('should open mobile drawer when menu button is clicked', async ({ page }) => {
      await page.goto('/dashboard')

      // Click mobile menu button
      const menuButton = page.getByRole('button', { name: /메뉴|menu/i })
      await menuButton.click()

      // Mobile nav drawer should be visible
      const mobileNav = page.locator('[data-testid="mobile-nav"]')
      await expect(mobileNav).toBeVisible()

      // Navigation items should be visible in drawer
      await expect(mobileNav.getByRole('link', { name: /대시보드/i })).toBeVisible()
      await expect(mobileNav.getByRole('link', { name: /포트폴리오/i })).toBeVisible()
    })

    test('should close mobile drawer after navigation', async ({ page }) => {
      await page.goto('/dashboard')

      // Open mobile menu
      await page.getByRole('button', { name: /메뉴|menu/i }).click()

      // Click a navigation link
      const mobileNav = page.locator('[data-testid="mobile-nav"]')
      await mobileNav.getByRole('link', { name: /포트폴리오/i }).click()

      // URL should change
      await expect(page).toHaveURL(/\/dashboard\/portfolio/)

      // Mobile nav should close
      await expect(mobileNav).not.toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels for navigation', async ({ page }) => {
      await page.goto('/dashboard')

      // Main navigation should have proper role
      await expect(page.getByRole('navigation', { name: /주 메뉴|main/i })).toBeVisible()
    })

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/dashboard')

      // Tab to first nav item
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should focus on navigation link
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBe('A')
    })
  })
})
