'use client'

import { useAdminAuth } from '@/hooks/useAdminAuth'
import { AdminLoginForm } from './components/AdminLoginForm'
import { AdminDashboard } from './components/AdminDashboard'

export default function AdminPage() {
  const { isAuthenticated, isLoading, error, login, logout } = useAdminAuth()

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        onSubmit={login}
        error={error}
        isLoading={isLoading}
      />
    )
  }

  return <AdminDashboard onLogout={logout} />
}
