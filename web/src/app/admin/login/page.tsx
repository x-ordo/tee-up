'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminLoginForm } from '../components/AdminLoginForm'

export default function AdminLoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, error, login } = useAdminAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-tee-ink-muted">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <AdminLoginForm onSubmit={login} error={error} isLoading={isLoading} />
}
