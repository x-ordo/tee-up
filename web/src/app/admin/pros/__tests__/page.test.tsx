/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminProsPage from '../page'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Admin Pros Management Page', () => {
  beforeEach(() => {
    // Clear any stored data
    localStorage.clear()
  })

  describe('Pending Applications', () => {
    it('should render pending pro applications list', () => {
      render(<AdminProsPage />)

      expect(screen.getByText(/승인 대기 중/i)).toBeInTheDocument()
      expect(screen.getByText(/Kim Soo-jin/i)).toBeInTheDocument()
      expect(screen.getByText(/Lee Dong-hyun/i)).toBeInTheDocument()
      expect(screen.getByText(/Park Min-ji/i)).toBeInTheDocument()
    })

    it('should show pro details including specialties and certifications', () => {
      render(<AdminProsPage />)

      // Check specialties
      expect(screen.getByText(/Putting/i)).toBeInTheDocument()
      expect(screen.getByText(/TrackMan Analysis/i)).toBeInTheDocument()

      // Check certifications - use getAllByText for text that appears multiple times
      expect(screen.getByText(/KLPGA Professional License/i)).toBeInTheDocument()
      expect(screen.getAllByText(/PGA Master Professional/i).length).toBeGreaterThan(0)
    })

    it('should have approve and reject buttons for each pending pro', () => {
      render(<AdminProsPage />)

      const approveButtons = screen.getAllByRole('button', { name: /승인/i })
      const rejectButtons = screen.getAllByRole('button', { name: /거부/i })

      expect(approveButtons).toHaveLength(3)
      expect(rejectButtons).toHaveLength(3)
    })

    it('should approve a pro when approve button is clicked', async () => {
      const user = userEvent.setup()
      render(<AdminProsPage />)

      const approveButtons = screen.getAllByRole('button', { name: /승인/i })

      // Click first approve button
      await user.click(approveButtons[0])

      await waitFor(() => {
        // Pro should be removed from pending list
        expect(screen.queryByText(/Kim Soo-jin/i)).not.toBeInTheDocument()
      })

      // Check approved pros section increased
      expect(screen.getByText(/승인된 프로 \(4\)/i)).toBeInTheDocument()
    })

    it('should reject a pro when reject button is clicked', async () => {
      const user = userEvent.setup()
      render(<AdminProsPage />)

      const rejectButtons = screen.getAllByRole('button', { name: /거부/i })

      // Click first reject button
      await user.click(rejectButtons[0])

      await waitFor(() => {
        // Pro should be removed from pending list
        expect(screen.queryByText(/Kim Soo-jin/i)).not.toBeInTheDocument()
      })

      // Pending count should decrease
      expect(screen.getByText(/승인 대기 중 \(2\)/i)).toBeInTheDocument()
    })

    it('should disable buttons while processing', async () => {
      const user = userEvent.setup()
      render(<AdminProsPage />)

      const approveButtons = screen.getAllByRole('button', { name: /승인/i })

      // Click approve button
      await user.click(approveButtons[0])

      // Button should be disabled immediately
      expect(approveButtons[0]).toBeDisabled()
    })

    it('should show empty state when no pending applications', async () => {
      const user = userEvent.setup()
      render(<AdminProsPage />)

      // Approve all pros
      const approveButtons = screen.getAllByRole('button', { name: /승인/i })

      for (const button of approveButtons) {
        await user.click(button)
        await waitFor(() => {
          expect(button).not.toBeInTheDocument()
        })
      }

      // Should show empty state
      expect(screen.getByText(/대기 중인 신청이 없습니다/i)).toBeInTheDocument()
    })
  })

  describe('Approved Pros', () => {
    it('should render approved pros list', () => {
      render(<AdminProsPage />)

      // Check section heading - use regex that matches the count
      expect(screen.getByText(/승인된 프로 \(\d+\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Hannah Park/i)).toBeInTheDocument()
      expect(screen.getByText(/James Kim/i)).toBeInTheDocument()
      expect(screen.getByText(/Sophia Lee/i)).toBeInTheDocument()
    })

    it('should show pro statistics', () => {
      render(<AdminProsPage />)

      // Check for profile views, leads, matched lessons - use getAllByText to handle duplicates
      expect(screen.getAllByText('247').length).toBeGreaterThan(0) // Hannah's profile views
      expect(screen.getAllByText('5').length).toBeGreaterThan(0) // Hannah's leads
      expect(screen.getAllByText('3').length).toBeGreaterThan(0) // Hannah's matched lessons
    })

    it('should show subscription tier badges', () => {
      render(<AdminProsPage />)

      const basicBadges = screen.getAllByText(/Basic/i)
      const proBadges = screen.getAllByText(/Pro/i)

      expect(basicBadges.length).toBeGreaterThan(0)
      expect(proBadges.length).toBeGreaterThan(0)
    })

    it('should have manage button for each approved pro', () => {
      render(<AdminProsPage />)

      // More specific query - look for links that are only "관리" (manage buttons in table)
      const allLinks = screen.getAllByRole('link')
      const manageButtons = allLinks.filter(link => link.textContent === '관리')

      expect(manageButtons).toHaveLength(3)
    })
  })

  describe('Navigation', () => {
    it('should have navigation tabs', () => {
      render(<AdminProsPage />)

      const navLinks = screen.getAllByRole('link')
      const navTexts = navLinks.map(link => link.textContent)

      expect(navTexts).toContain('대시보드')
      expect(navTexts).toContain('프로 관리')
      expect(navTexts).toContain('채팅 관리')
      expect(navTexts).toContain('사용자 관리')
      expect(navTexts).toContain('분석')
    })

    it('should have back to dashboard link', () => {
      render(<AdminProsPage />)

      const backLink = screen.getByRole('link', { name: /← 대시보드/i })
      expect(backLink).toHaveAttribute('href', '/admin')
    })
  })
})
