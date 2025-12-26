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
    <div className="flex min-h-screen items-center justify-center bg-tee-background">
      <div className="rounded-2xl bg-tee-surface shadow-card w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold text-tee-ink-strong">
          관리자 로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-body-sm font-medium text-tee-ink-light">
              이메일
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
            <label htmlFor="password" className="mb-2 block text-body-sm font-medium text-tee-ink-light">
              비밀번호
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
              placeholder="관리자 비밀번호를 입력하세요"
              disabled={isLoading}
              required
            />
          </div>

          {/* Error Message */}
          {displayError && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-tee-error bg-tee-error/10 p-4 text-tee-error"
            >
              <p className="font-medium">{error}</p>
              <p className="mt-1 text-xs opacity-80">
                계속 문제가 발생하면 운영 팀에 알려주세요.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="h-12 rounded-xl bg-tee-accent-primary px-6 py-3 font-medium text-white transition-colors hover:bg-tee-accent-primary-hover w-full"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
