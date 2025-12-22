/**
 * Theme configuration types and defaults
 */

export interface ThemeConfig {
  accentColor: string
  logoUrl: string | null
  fontPreset: 'default' | 'modern' | 'classic'
  darkModeEnabled: boolean
}

export const DEFAULT_THEME: ThemeConfig = {
  accentColor: '#0A362B',
  logoUrl: null,
  fontPreset: 'default',
  darkModeEnabled: true,
}

/**
 * Get default theme configuration
 */
export function getDefaultTheme(): ThemeConfig {
  return { ...DEFAULT_THEME }
}
