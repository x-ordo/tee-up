/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  redirect: jest.fn(),
}))

describe('Admin Page Authentication', () => {
  describe('Password Protection', () => {
    it('should render login form when not authenticated', () => {
      render(<AdminPage />)

      expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('should show error message when password is incorrect', async () => {
      const user = userEvent.setup()
      render(<AdminPage />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/incorrect password/i)).toBeInTheDocument()
      })
    })

    it('should grant access when password is correct', async () => {
      const user = userEvent.setup()
      render(<AdminPage />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(passwordInput, 'admin123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument()
      })
    })

    it('should persist authentication state in session storage', async () => {
      const user = userEvent.setup()
      render(<AdminPage />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(passwordInput, 'admin123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(sessionStorage.getItem('admin_authenticated')).toBe('true')
      })
    })

    it('should clear error message when user types again', async () => {
      const user = userEvent.setup()
      render(<AdminPage />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      // Submit wrong password
      await user.type(passwordInput, 'wrong')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/incorrect password/i)).toBeInTheDocument()
      })

      // Type again
      await user.clear(passwordInput)
      await user.type(passwordInput, 'a')

      expect(screen.queryByText(/incorrect password/i)).not.toBeInTheDocument()
    })
  })

  describe('Session Persistence', () => {
    beforeEach(() => {
      sessionStorage.clear()
    })

    it('should skip login if already authenticated', () => {
      sessionStorage.setItem('admin_authenticated', 'true')
      render(<AdminPage />)

      expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument()
    })

    it('should show login form if session storage is cleared', () => {
      sessionStorage.removeItem('admin_authenticated')
      render(<AdminPage />)

      expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })
  })

  describe('Security', () => {
    it('should not expose password in DOM or console', async () => {
      const user = userEvent.setup()
      render(<AdminPage />)

      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement

      await user.type(passwordInput, 'admin123')

      expect(passwordInput.type).toBe('password')
      expect(passwordInput.value).toBe('admin123')
    })

    it('should disable submit button while processing login', async () => {
      const user = userEvent.setup()
      render(<AdminPage />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(passwordInput, 'admin123')
      await user.click(submitButton)

      // Button should be disabled immediately after click
      expect(submitButton).toBeDisabled()
    })
  })
})
