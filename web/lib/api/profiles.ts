import { createClient } from '@/lib/supabase/client'

export type ProProfile = {
  id: string
  user_id: string
  slug: string
  title: string
  bio: string | null
  specialties: string[] | null
  hero_image_url: string | null
  profile_image_url: string | null
  profile_views: number
  monthly_chat_count: number
  total_leads: number
  matched_lessons: number
  rating: number
  subscription_tier: 'basic' | 'pro'
  subscription_expires_at: string | null
  is_approved: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string
    avatar_url: string | null
    phone: string | null
  }
}

export type ProProfileInsert = Omit<
  ProProfile,
  'id' | 'profile_views' | 'monthly_chat_count' | 'total_leads' | 'matched_lessons' | 'rating' | 'subscription_tier' | 'subscription_expires_at' | 'is_approved' | 'is_featured' | 'created_at' | 'updated_at' | 'profiles'
> & {
  user_id: string
  slug: string
  title: string
}

export type ProProfileUpdate = Partial<Omit<ProProfile, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles'>>

/**
 * Fetch all pro profiles with basic user info
 */
export async function getAllProfiles(): Promise<ProProfile[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .select('*, profiles(full_name, avatar_url)')

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Fetch a single pro profile by slug
 */
export async function getProfileBySlug(slug: string): Promise<ProProfile | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .select('*, profiles(full_name, avatar_url, phone)')
    .eq('slug', slug)
    .single()

  if (error) {
    // Not found is acceptable, return null
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(error.message)
  }

  return data
}

/**
 * Create a new pro profile
 */
export async function createProfile(profile: ProProfileInsert): Promise<ProProfile> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .insert(profile)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Update an existing pro profile
 */
export async function updateProfile(id: string, updates: ProProfileUpdate): Promise<ProProfile> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Increment profile views using database function
 */
export async function incrementProfileViews(profileId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc('increment_profile_views', {
    profile_id: profileId,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// ========================================
// Admin Functions for Pro Management
// ========================================

export type PendingProProfile = ProProfile & {
  profiles: {
    full_name: string
    avatar_url: string | null
    phone: string | null
  }
  location: string | null
  tour_experience: string | null
  certifications: string[] | null
}

export type ApprovedProProfile = ProProfile & {
  profiles: {
    full_name: string
    avatar_url: string | null
    phone: string | null
  }
  location: string | null
}

/**
 * Fetch all pending (unapproved) pro profiles - Admin only
 */
export async function getPendingProProfiles(): Promise<PendingProProfile[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .select('*, profiles(full_name, avatar_url, phone)')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Fetch all approved pro profiles - Admin only
 */
export async function getApprovedProProfiles(): Promise<ApprovedProProfile[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .select('*, profiles(full_name, avatar_url, phone)')
    .eq('is_approved', true)
    .order('approved_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Approve a pro profile - Admin only
 */
export async function approveProProfile(id: string): Promise<ProProfile> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .update({
      is_approved: true,
      approved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Reject (delete) a pro profile - Admin only
 */
export async function rejectProProfile(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('pro_profiles')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Get a single pro profile by ID - Admin only
 */
export async function getProProfileById(id: string): Promise<PendingProProfile | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .select('*, profiles(full_name, avatar_url, phone)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(error.message)
  }

  return data
}

/**
 * Update pro profile featured status - Admin only
 */
export async function updateProFeaturedStatus(id: string, isFeatured: boolean): Promise<ProProfile> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pro_profiles')
    .update({ is_featured: isFeatured })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
