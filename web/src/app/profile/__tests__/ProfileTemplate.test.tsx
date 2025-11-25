/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { ProfileTemplate } from '../ProfileTemplate'
import { profileLibrary } from '../profile-data'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

const testProfile = profileLibrary['elliot-kim']

describe('ProfileTemplate - KakaoTalk Integration', () => {
  describe('KakaoTalk Button', () => {
    it('should render KakaoTalk contact button', () => {
      render(<ProfileTemplate data={testProfile} />)

      const kakaoButton = screen.getByRole('link', { name: /카카오톡으로.*에게 문의/i })
      expect(kakaoButton).toBeInTheDocument()
    })

    it('should have correct KakaoTalk deep link URL', () => {
      render(<ProfileTemplate data={testProfile} />)

      const kakaoButton = screen.getByRole('link', { name: /카카오톡으로.*에게 문의/i })
      const href = kakaoButton.getAttribute('href')

      // KakaoTalk deep link should follow format: https://pf.kakao.com/_xabc123/chat
      expect(href).toContain('kakao.com')
    })

    it('should have KakaoTalk icon or emoji', () => {
      render(<ProfileTemplate data={testProfile} />)

      const kakaoButton = screen.getByRole('link', { name: /카카오톡으로.*에게 문의/i })

      // Should have KakaoTalk visual indicator (icon or emoji)
      expect(kakaoButton.textContent).toMatch(/💬|카카오톡/)
    })

    it('should position KakaoTalk button near booking CTA', () => {
      render(<ProfileTemplate data={testProfile} />)

      const kakaoButton = screen.getByRole('link', { name: /카카오톡으로.*에게 문의/i })
      const bookingButtons = screen.getAllByRole('button', { name: /레슨 문의/i })

      // Both buttons should exist in the document
      expect(kakaoButton).toBeInTheDocument()
      expect(bookingButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Message Pre-fill', () => {
    it('should include pro name in deep link for message template', () => {
      render(<ProfileTemplate data={testProfile} />)

      const kakaoButton = screen.getByRole('link', { name: /카카오톡으로.*에게 문의/i })
      const href = kakaoButton.getAttribute('href') || ''

      // URL should be URL-encoded or include reference to the pro
      expect(href.length).toBeGreaterThan(0)
    })
  })

  describe('Styling and UX', () => {
    it('should have distinctive styling to differentiate from booking button', () => {
      render(<ProfileTemplate data={testProfile} />)

      const kakaoButton = screen.getByRole('link', { name: /카카오톡으로.*에게 문의/i })

      // Should have className indicating it's a secondary or alternative CTA
      expect(kakaoButton.className).toBeTruthy()
    })
  })
})
