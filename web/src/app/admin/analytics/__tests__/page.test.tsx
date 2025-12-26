/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminAnalyticsPage from '../page'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Admin Analytics Page', () => {
  describe('KPI Metrics', () => {
    it('should render KPI metrics', () => {
      render(<AdminAnalyticsPage />)

      expect(screen.getByText(/핵심 성과 지표/i)).toBeInTheDocument()
      expect(screen.getByText(/월간 활성 사용자/i)).toBeInTheDocument()
      expect(screen.getAllByText('1,247').length).toBeGreaterThan(0)
      expect(screen.getByText(/총 레슨 매칭/i)).toBeInTheDocument()
      expect(screen.getAllByText(/전환율/i).length).toBeGreaterThan(0)
    })

    it('should show trend indicators', () => {
      render(<AdminAnalyticsPage />)

      // Should show positive trends
      expect(screen.getByText(/\+18\.5%/i)).toBeInTheDocument()
      expect(screen.getByText(/\+12 this month/i)).toBeInTheDocument()
    })
  })

  describe('Time Period Filter', () => {
    it('should have time period filter buttons', () => {
      render(<AdminAnalyticsPage />)

      expect(screen.getByRole('button', { name: /7일/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /30일/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /90일/i })).toBeInTheDocument()
    })

    it('should highlight selected time period', () => {
      render(<AdminAnalyticsPage />)

      const button30Days = screen.getByRole('button', { name: /30일/i })

      // Default should be 30 days selected
      expect(button30Days).toHaveClass('bg-tee-accent-primary')
    })

    it('should update metrics when time period changes', async () => {
      const user = userEvent.setup()
      render(<AdminAnalyticsPage />)

      const button7Days = screen.getByRole('button', { name: /7일/i })

      // Click 7 days button
      await user.click(button7Days)

      await waitFor(() => {
        // Button should be selected
        expect(button7Days).toHaveClass('bg-tee-accent-primary')
      })
    })
  })

  describe('Revenue Trends', () => {
    it('should render revenue table', () => {
      render(<AdminAnalyticsPage />)

      expect(screen.getByText(/수익 트렌드/i)).toBeInTheDocument()
      expect(screen.getByText(/10월/i)).toBeInTheDocument()
      expect(screen.getByText(/11월/i)).toBeInTheDocument()
      expect(screen.getByText(/12월/i)).toBeInTheDocument()
    })

    it('should show revenue statistics', () => {
      render(<AdminAnalyticsPage />)

      expect(screen.getByText(/평균 구독 가격/i)).toBeInTheDocument()
      expect(screen.getAllByText('₩49,000').length).toBeGreaterThan(0)
      expect(screen.getByText(/구독 전환율/i)).toBeInTheDocument()
      expect(screen.getAllByText('25.5%').length).toBeGreaterThan(0)
    })
  })

  describe('Pro Performance', () => {
    it('should render pro leaderboard', () => {
      render(<AdminAnalyticsPage />)

      expect(screen.getByText(/프로 성과 순위/i)).toBeInTheDocument()
      expect(screen.getByText(/Hannah Park/i)).toBeInTheDocument()
      expect(screen.getByText(/James Kim/i)).toBeInTheDocument()
      expect(screen.getByText(/Sophia Lee/i)).toBeInTheDocument()
    })

    it('should show ranking badges', () => {
      render(<AdminAnalyticsPage />)

      // Check for rankings 1, 2, 3
      const rankings = screen.getAllByText(/^[1-3]$/)
      expect(rankings.length).toBeGreaterThan(0)
    })
  })

  describe('Platform Health', () => {
    it('should render platform health metrics', () => {
      render(<AdminAnalyticsPage />)

      expect(screen.getByText(/플랫폼 상태/i)).toBeInTheDocument()
      expect(screen.getByText(/프로 활동률/i)).toBeInTheDocument()
      expect(screen.getByText(/83\.0%/i)).toBeInTheDocument()
      expect(screen.getByText(/골퍼 참여도/i)).toBeInTheDocument()
      expect(screen.getByText(/71\.5%/i)).toBeInTheDocument()
    })

    it('should show progress bars for health metrics', () => {
      render(<AdminAnalyticsPage />)

      // Check for progress bars (elements with specific widths)
      const progressBars = document.querySelectorAll('[style*="width"]')
      expect(progressBars.length).toBeGreaterThan(0)
    })
  })

  describe('Navigation', () => {
    it('should have navigation tabs', () => {
      render(<AdminAnalyticsPage />)

      const navLinks = screen.getAllByRole('link')
      const navTexts = navLinks.map(link => link.textContent)

      expect(navTexts).toContain('대시보드')
      expect(navTexts).toContain('프로 관리')
      expect(navTexts).toContain('채팅 관리')
      expect(navTexts).toContain('사용자 관리')
      expect(navTexts).toContain('분석')
    })

    it('should have back to dashboard link', () => {
      render(<AdminAnalyticsPage />)

      const backLink = screen.getByRole('link', { name: /← 대시보드/i })
      expect(backLink).toHaveAttribute('href', '/admin')
    })
  })
})
