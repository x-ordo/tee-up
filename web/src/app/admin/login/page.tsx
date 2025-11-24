'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user) {
        // 로그인 성공 - 관리자 페이지로 리다이렉트
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-calm-white">
      <div className="w-full max-w-md rounded-2xl border border-calm-stone bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-calm-obsidian">TEE:UP Admin</h1>
          <p className="mt-2 text-body-sm text-calm-ash">관리자 로그인</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-calm-obsidian">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input w-full"
              placeholder="admin@teeup.com"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-calm-obsidian"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input w-full"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-error bg-error/10 p-4">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-accent hover:underline">
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
