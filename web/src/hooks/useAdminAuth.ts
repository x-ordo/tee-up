import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'admin123'
const AUTH_STORAGE_KEY = 'admin_authenticated'

interface UseAdminAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  error: string
  login: (password: string) => Promise<void>
  logout: () => void
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check session storage for existing authentication
    const authStatus = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (password: string): Promise<void> => {
    setIsLoading(true)
    setError('')

    // Simulate async validation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (password === ADMIN_PASSWORD) {
          sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
          setIsAuthenticated(true)
        } else {
          setError('Incorrect password')
        }
        setIsLoading(false)
        resolve()
      }, 100)
    })
  }

  const logout = (): void => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  }
}
