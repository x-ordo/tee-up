'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult, ThemeType } from './types';

/**
 * Pro Profile type from database
 */
export type ProProfile = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bio: string | null;
  specialties: string[];
  location: string | null;
  tour_experience: string | null;
  certifications: string[];
  theme_type: ThemeType;
  payment_link: string | null;
  open_chat_url: string | null;
  booking_url: string | null;
  hero_image_url: string | null;
  profile_image_url: string | null;
  gallery_images: string[];
  video_url: string | null;
  instagram_username: string | null;
  youtube_channel_id: string | null;
  kakao_talk_id: string | null;
  profile_views: number;
  monthly_lead_count: number;
  total_leads: number;
  matched_lessons: number;
  rating: number;
  subscription_tier: 'free' | 'basic' | 'pro';
  is_approved: boolean;
  is_featured: boolean;
  studio_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ProProfileInsert = Omit<
  ProProfile,
  'id' | 'profile_views' | 'monthly_lead_count' | 'total_leads' | 'matched_lessons' | 'rating' | 'is_approved' | 'is_featured' | 'created_at' | 'updated_at'
>;

export type ProProfileUpdate = Partial<
  Omit<ProProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUserProfile(): Promise<ActionResult<ProProfile | null>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch profile' };
  }
}

/**
 * Get a public profile by slug (no auth required)
 */
export async function getPublicProfile(
  slug: string
): Promise<ActionResult<ProProfile | null>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('is_approved', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch profile' };
  }
}

/**
 * Get all approved profiles (for directory)
 */
export async function getApprovedProfiles(): Promise<ActionResult<ProProfile[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('is_approved', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch profiles' };
  }
}

/**
 * Update a pro profile
 */
export async function updateProProfile(
  profileId: string,
  updates: ProProfileUpdate
): Promise<ActionResult<ProProfile>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('pro_profiles')
      .update(updates)
      .eq('id', profileId)
      .eq('user_id', user.id) // RLS backup
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate profile pages
    revalidatePath(`/${data.slug}`);
    revalidatePath('/dashboard/portfolio');

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Create a new pro profile
 */
export async function createProProfile(
  profileData: Omit<ProProfileInsert, 'user_id'>
): Promise<ActionResult<ProProfile>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Generate slug from title if not provided
    const slug =
      profileData.slug ||
      profileData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('pro_profiles')
      .insert({
        ...profileData,
        user_id: user.id,
        slug,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to create profile' };
  }
}

/**
 * Increment profile views (for analytics)
 */
export async function incrementProfileViews(
  slug: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.rpc('increment_profile_views', {
      profile_slug: slug,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to increment views' };
  }
}
