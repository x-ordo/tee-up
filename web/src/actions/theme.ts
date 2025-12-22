'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from './types'
import { isValidHexColor } from '@/lib/color-utils'
import { DEFAULT_THEME, type ThemeConfig } from '@/lib/theme-config'

// Re-export ThemeConfig type for convenience
export type { ThemeConfig } from '@/lib/theme-config'

/**
 * Get a pro's theme configuration
 */
export async function getProTheme(profileId: string): Promise<ActionResult<ThemeConfig>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .select('theme_config')
    .eq('id', profileId)
    .single()

  if (error) return { success: false, error: error.message }

  return {
    success: true,
    data: { ...DEFAULT_THEME, ...(data?.theme_config as Partial<ThemeConfig>) },
  }
}

/**
 * Update a pro's theme configuration
 */
export async function updateProTheme(
  profileId: string,
  updates: Partial<ThemeConfig>
): Promise<ActionResult<ThemeConfig>> {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Validate accent color if provided
  if (updates.accentColor && !isValidHexColor(updates.accentColor)) {
    return { success: false, error: 'Invalid accent color format. Use hex format like #0A362B' }
  }

  // Validate font preset if provided
  if (updates.fontPreset && !['default', 'modern', 'classic'].includes(updates.fontPreset)) {
    return { success: false, error: 'Invalid font preset' }
  }

  // Get current config
  const current = await getProTheme(profileId)
  if (!current.success) return current

  const newConfig = { ...current.data, ...updates }

  const { error } = await supabase
    .from('pro_profiles')
    .update({ theme_config: newConfig })
    .eq('id', profileId)
    .eq('user_id', user.id) // RLS check

  if (error) return { success: false, error: error.message }

  revalidatePath(`/[slug]`, 'page')
  revalidatePath('/dashboard/settings')

  return { success: true, data: newConfig }
}

