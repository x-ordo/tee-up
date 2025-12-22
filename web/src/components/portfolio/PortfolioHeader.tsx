'use client'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { ThemeConfig } from '@/actions/theme'

interface PortfolioHeaderProps {
  /** Theme configuration for the portfolio */
  themeConfig?: ThemeConfig
  /** Pro's name for aria-label */
  proName?: string
}

/**
 * Portfolio page header with theme toggle
 * Only shows if darkModeEnabled is true in theme config
 */
export function PortfolioHeader({ themeConfig, proName }: PortfolioHeaderProps) {
  // Don't show theme toggle if dark mode is disabled for this portfolio
  if (themeConfig && !themeConfig.darkModeEnabled) {
    return null
  }

  return (
    <div
      className="fixed right-4 top-4 z-50"
      role="navigation"
      aria-label={`${proName || '포트폴리오'} 테마 설정`}
    >
      <ThemeToggle />
    </div>
  )
}
