'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import type { Theme, ThemePreference } from '@/lib/theme'

interface UseThemeReturn {
  theme: Theme | undefined
  themePreference: ThemePreference | undefined
  setTheme: (theme: ThemePreference) => void
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  mounted: boolean
}

/**
 * Type-safe wrapper for next-themes useTheme hook
 * Provides additional utilities for theme management
 */
export function useTheme(): UseThemeReturn {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme } = useNextTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = (resolvedTheme as Theme) || 'light'
  const currentPreference = (theme as ThemePreference) || 'system'

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: mounted ? currentTheme : undefined,
    themePreference: mounted ? currentPreference : undefined,
    setTheme: (newTheme: ThemePreference) => setTheme(newTheme),
    toggleTheme,
    isDark: mounted && currentTheme === 'dark',
    isLight: mounted && currentTheme === 'light',
    mounted,
  }
}

export default useTheme
