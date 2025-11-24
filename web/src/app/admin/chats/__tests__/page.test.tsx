/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminChatsPage from '../page'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Admin Chats Management Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Stats Overview', () => {
    it('should render chat statistics', () => {
      render(<AdminChatsPage />)

      expect(screen.getByText(/전체 채팅방/i)).toBeInTheDocument()
      expect(screen.getAllByText('156').length).toBeGreaterThan(0)
      expect(screen.getByText(/활성 대화/i)).toBeInTheDocument()
      expect(screen.getAllByText('23').length).toBeGreaterThan(0)
      expect(screen.getAllByText(/매칭 완료/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText('89').length).toBeGreaterThan(0)
    })
  })

  describe('Flagged Messages', () => {
    it('should render flagged messages list', () => {
      render(<AdminChatsPage />)

      expect(screen.getByText(/신고된 메시지 \(\d+\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Unknown User/i)).toBeInTheDocument()
      expect(screen.getByText(/Pro Lee/i)).toBeInTheDocument()
    })

    it('should show flagged message content and reason', () => {
      render(<AdminChatsPage />)

      expect(screen.getByText(/다른 플랫폼에서 연락주세요/i)).toBeInTheDocument()
      expect(screen.getByText(/Off-platform contact attempt/i)).toBeInTheDocument()
      expect(screen.getByText(/Potential scam - upfront payment request/i)).toBeInTheDocument()
    })

    it('should have action buttons for each flagged message', () => {
      render(<AdminChatsPage />)

      const actionButtons = screen.getAllByRole('button', { name: /조치/i })
      const dismissButtons = screen.getAllByRole('button', { name: /무시/i })

      expect(actionButtons).toHaveLength(2)
      expect(dismissButtons).toHaveLength(2)
    })

    it('should take action on flagged message when action button clicked', async () => {
      const user = userEvent.setup()
      render(<AdminChatsPage />)

      const actionButtons = screen.getAllByRole('button', { name: /조치/i })

      // Click first action button
      await user.click(actionButtons[0])

      await waitFor(() => {
        // Message should be removed from flagged list
        expect(screen.queryByText(/Unknown User/i)).not.toBeInTheDocument()
      })

      // Count should decrease
      expect(screen.getByText(/신고된 메시지 \(1\)/i)).toBeInTheDocument()
    })

    it('should dismiss flagged message when dismiss button clicked', async () => {
      const user = userEvent.setup()
      render(<AdminChatsPage />)

      const dismissButtons = screen.getAllByRole('button', { name: /무시/i })

      // Click first dismiss button
      await user.click(dismissButtons[0])

      await waitFor(() => {
        // Message should be removed from flagged list
        expect(screen.queryByText(/Unknown User/i)).not.toBeInTheDocument()
      })

      // Count should decrease
      expect(screen.getByText(/신고된 메시지 \(1\)/i)).toBeInTheDocument()
    })

    it('should disable buttons while processing', async () => {
      const user = userEvent.setup()
      render(<AdminChatsPage />)

      const actionButtons = screen.getAllByRole('button', { name: /조치/i })

      // Click action button
      await user.click(actionButtons[0])

      // Button should be disabled immediately
      expect(actionButtons[0]).toBeDisabled()
    })
  })

  describe('Chat Rooms List', () => {
    it('should render active chat rooms', () => {
      render(<AdminChatsPage />)

      expect(screen.getByText(/Park Ji-sung/i)).toBeInTheDocument()
      expect(screen.getByText(/Kim Min-jae/i)).toBeInTheDocument()
      expect(screen.getByText(/Lee Soo-hyun/i)).toBeInTheDocument()
      expect(screen.getByText(/Choi Yeon-woo/i)).toBeInTheDocument()
    })

    it('should show chat room details', () => {
      render(<AdminChatsPage />)

      // Check for pro names
      expect(screen.getByText(/Hannah Park/i)).toBeInTheDocument()
      expect(screen.getByText(/James Kim/i)).toBeInTheDocument()

      // Check for last messages
      expect(screen.getByText(/다음 주 화요일 오후 2시 가능할까요/i)).toBeInTheDocument()
    })

    it('should show status badges correctly', () => {
      render(<AdminChatsPage />)

      // Get all status badges
      const statusElements = screen.getAllByText(/활성|매칭 완료|종료/)

      // Should have status badges for each room (4 rooms)
      expect(statusElements.length).toBeGreaterThanOrEqual(2)
    })

    it('should show unread count badges', () => {
      render(<AdminChatsPage />)

      // Should show unread counts for rooms with unread messages
      expect(screen.getByText('2')).toBeInTheDocument() // Room 1 has 2 unread
      expect(screen.getByText('1')).toBeInTheDocument() // Room 3 has 1 unread
    })

    it('should have view button for each chat room', () => {
      render(<AdminChatsPage />)

      const viewButtons = screen.getAllByRole('link', { name: /보기/i })

      expect(viewButtons).toHaveLength(4)
    })
  })

  describe('Navigation', () => {
    it('should have navigation tabs', () => {
      render(<AdminChatsPage />)

      const navLinks = screen.getAllByRole('link')
      const navTexts = navLinks.map(link => link.textContent)

      expect(navTexts).toContain('대시보드')
      expect(navTexts).toContain('프로 관리')
      expect(navTexts).toContain('채팅 관리')
      expect(navTexts).toContain('사용자 관리')
      expect(navTexts).toContain('분석')
    })

    it('should have back to dashboard link', () => {
      render(<AdminChatsPage />)

      const backLink = screen.getByRole('link', { name: /← 대시보드/i })
      expect(backLink).toHaveAttribute('href', '/admin')
    })
  })

  describe('Insights', () => {
    it('should show chat insights metrics', () => {
      render(<AdminChatsPage />)

      expect(screen.getByText(/평균 응답 시간/i)).toBeInTheDocument()
      expect(screen.getByText(/2\.3시간/i)).toBeInTheDocument()
      expect(screen.getByText(/매칭 성공률/i)).toBeInTheDocument()
      expect(screen.getAllByText(/57\.1%/i).length).toBeGreaterThan(0)
    })
  })
})
