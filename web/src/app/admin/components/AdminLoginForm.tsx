'use client'

import { useState, FormEvent } from 'react'

interface AdminLoginFormProps {
  onSubmit: (password: string) => Promise<void>
  error: string
  isLoading: boolean
}

export function AdminLoginForm({ onSubmit, error, isLoading }: AdminLoginFormProps) {
  const [password, setPassword] = useState('')
  const [errorCleared, setErrorCleared] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorCleared(false)
    await onSubmit(password)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-body-sm font-medium text-calm-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="input w-full"
              placeholder="Enter admin password"
              disabled={isLoading}
            />
            {displayError && (
              <p className="mt-2 text-body-sm text-error">{error}</p>
            )}
          </div>

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
