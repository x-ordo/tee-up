'use client'

import { useState, FormEvent } from 'react'

interface AdminLoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  error: string
  isLoading: boolean
}

export function AdminLoginForm({ onSubmit, error, isLoading }: AdminLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorCleared, setErrorCleared] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorCleared(false)
    await onSubmit(email, password)
  }

  const handleChange = () => {
    if (error && !errorCleared) {
      setErrorCleared(true)
    }
  }

  const displayError = error && !errorCleared

  return (
    <div className="flex min-h-screen items-center justify-center bg-calm-white">
      <div className="card w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold text-calm-obsidian">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-body-sm font-medium text-calm-charcoal">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                handleChange()
              }}
              className="input w-full"
              placeholder="admin@teeup.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="mb-2 block text-body-sm font-medium text-calm-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                handleChange()
              }}
              className="input w-full"
              placeholder="Enter admin password"
              disabled={isLoading}
              required
            />
          </div>

          {/* Error Message */}
          {displayError && (
            <div
              role="alert"
              aria-live="polite"
              className="alert-error"
            >
              <p className="font-medium">{error}</p>
              <p className="mt-1 text-xs opacity-80">
                문제가 지속되면 관리자에게 문의해주세요.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
