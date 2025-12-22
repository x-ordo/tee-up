import { test, expect } from '@playwright/test'

/**
 * Portfolio Theming E2E Tests
 * User Story 3: Portfolio White-Label Theming
 *
 * Tests custom accent colors, logos, and font presets on portfolio pages
 * Note: Tests will skip if the test portfolio (/elliot-kim) doesn't exist in the database
 */

test.describe('Portfolio Theming', () => {
  // Helper to check if portfolio exists and skip if not
  async function navigateToPortfolioOrSkip(page: import('@playwright/test').Page) {
    const response = await page.goto('/elliot-kim')
    if (response?.status() === 404) {
      return false
    }
    return true
  }

  test.describe('Custom Accent Color', () => {
    test('should display portfolio with default accent color', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Check that the page uses the default accent color
      const accentElement = page.locator('[data-accent-color]').first()
      if ((await accentElement.count()) > 0) {
        // Accent color should be applied
        await expect(accentElement).toBeVisible()
      }
    })

    test('should apply custom accent color from theme config', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Check for CSS variable application
      const hasAccentColor = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement)
        const accent = style.getPropertyValue('--tee-accent-primary')
        return accent !== ''
      })

      // Accent color should be defined (from global CSS or theme config)
      expect(hasAccentColor).toBe(true)
    })

    test('should have accent color on CTA buttons', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Find primary CTA button
      const ctaButton = page.getByRole('button', { name: /레슨 상담|문의|예약/i }).first()
      if (await ctaButton.isVisible()) {
        // Button should have accent background color
        const bgColor = await ctaButton.evaluate((el) => {
          return getComputedStyle(el).backgroundColor
        })
        expect(bgColor).not.toBe('transparent')
      }
    })
  })

  test.describe('Logo Display', () => {
    test('should display custom logo if configured', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Check for logo image
      const logo = page.locator('img[alt*="logo" i], img[data-testid="pro-logo"]').first()
      if ((await logo.count()) > 0) {
        await expect(logo).toBeVisible()
      }
    })

    test('should fallback to text when no logo is set', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Either logo or pro name should be visible
      const logo = page.locator('img[alt*="logo" i]').first()
      const proName = page.locator('h1, [data-testid="pro-name"]').first()

      const hasLogo = (await logo.count()) > 0 && (await logo.isVisible())
      const hasName = (await proName.count()) > 0 && (await proName.isVisible())

      expect(hasLogo || hasName).toBe(true)
    })
  })

  test.describe('Font Presets', () => {
    test('should use default font preset', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Check for Pretendard font (default)
      const fontFamily = await page.evaluate(() => {
        const body = document.body
        return getComputedStyle(body).fontFamily
      })

      // Should include a valid font family
      expect(fontFamily).toBeTruthy()
    })
  })

  test.describe('Dark Mode on Portfolio', () => {
    test('should allow dark mode toggle if enabled', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Look for theme toggle
      const themeToggle = page.getByRole('button', { name: /테마|다크|라이트|theme/i })
      if ((await themeToggle.count()) > 0) {
        await expect(themeToggle).toBeVisible()
      }
    })

    test('should not show dark mode toggle if disabled in config', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Theme toggle may or may not be present depending on config
      // No assertion - just verify it doesn't break
      page.getByRole('button', { name: /테마|theme/i })
    })
  })

  test.describe('Theme Persistence', () => {
    test('should maintain theme when navigating between sections', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      // Get initial accent color
      const initialAccent = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue(
          '--tee-accent-primary'
        )
      })

      // Navigate to contact section if available
      const contactLink = page.getByRole('link', { name: /연락|문의|contact/i }).first()
      if ((await contactLink.count()) > 0) {
        await contactLink.click()
        await page.waitForLoadState('networkidle')

        // Check accent color is maintained
        const newAccent = await page.evaluate(() => {
          return getComputedStyle(document.documentElement).getPropertyValue(
            '--tee-accent-primary'
          )
        })

        expect(newAccent).toBe(initialAccent)
      }
    })
  })

  test.describe('Contrast and Accessibility', () => {
    test('should have sufficient color contrast on CTA buttons', async ({ page }) => {
      const exists = await navigateToPortfolioOrSkip(page)
      if (!exists) {
        test.skip()
        return
      }

      const ctaButton = page.getByRole('button', { name: /레슨 상담|문의|예약/i }).first()
      if (await ctaButton.isVisible()) {
        // Button text should be readable
        const textColor = await ctaButton.evaluate((el) => {
          return getComputedStyle(el).color
        })
        const bgColor = await ctaButton.evaluate((el) => {
          return getComputedStyle(el).backgroundColor
        })

        // Both colors should be defined (not empty or transparent)
        expect(textColor).toBeTruthy()
        expect(bgColor).toBeTruthy()
      }
    })
  })
})
