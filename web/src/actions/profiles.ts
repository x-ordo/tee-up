'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult, ThemeType } from './types';
import type { ThemeConfig } from './theme';

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
  theme_config: ThemeConfig | null;
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
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
  } catch (_err) {
    return { success: false, error: 'Failed to increment views' };
  }
}

// ============================================
// Quick Setup (PRD v1.2)
// ============================================

export interface QuickProfileInput {
  name: string;
  bio?: string;
  specialty: string;
  location?: string;
  priceRange?: string;
  contactType: 'kakao' | 'phone';
  contactValue: string;
}

/**
 * Create a quick profile for new pros (5-minute onboarding)
 * PRD v1.2: "무료 홍보 페이지 중심" 전략
 */
export async function createQuickProfile(
  input: QuickProfileInput
): Promise<ActionResult<{ slug: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('pro_profiles')
      .select('id, slug')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      // Update existing profile instead of creating new one
      const updateData: ProProfileUpdate = {
        title: input.name,
        bio: input.bio || null,
        specialties: [input.specialty],
        location: input.location || null,
      };

      // Set contact based on type
      if (input.contactType === 'kakao') {
        updateData.open_chat_url = input.contactValue;
      } else {
        updateData.kakao_talk_id = input.contactValue; // Store phone in kakao_talk_id temporarily
      }

      const { error: updateError } = await supabase
        .from('pro_profiles')
        .update(updateData)
        .eq('id', existingProfile.id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      revalidatePath('/dashboard');
      revalidatePath(`/profile/${existingProfile.slug}`);
      return { success: true, data: { slug: existingProfile.slug } };
    }

    // Generate unique slug from name
    const baseSlug = input.name
      .toLowerCase()
      .replace(/[가-힣]/g, (char) => {
        // Simple Korean to romanization mapping for common syllables
        const romanMap: Record<string, string> = {
          '김': 'kim', '이': 'lee', '박': 'park', '최': 'choi', '정': 'jung',
          '강': 'kang', '조': 'cho', '윤': 'yoon', '장': 'jang', '임': 'lim',
          '한': 'han', '오': 'oh', '서': 'seo', '신': 'shin', '권': 'kwon',
          '황': 'hwang', '안': 'ahn', '송': 'song', '전': 'jeon', '홍': 'hong',
          '유': 'yoo', '고': 'ko', '문': 'moon', '양': 'yang', '손': 'son',
          '배': 'bae', '백': 'baek', '허': 'heo', '남': 'nam', '심': 'shim',
          '노': 'noh', '하': 'ha', '곽': 'kwak', '성': 'sung', '차': 'cha',
          '주': 'joo', '우': 'woo', '민': 'min', '류': 'ryu', '나': 'na',
          '진': 'jin', '프': 'pro', '로': 'ro',
        };
        return romanMap[char] || char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'pro';

    // Add random suffix for uniqueness
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    // Build profile data
    const profileData = {
      user_id: user.id,
      slug,
      title: input.name,
      bio: input.bio || null,
      specialties: [input.specialty],
      location: input.location || null,
      certifications: [],
      theme_type: 'curriculum' as const, // Default template
      theme_config: null,
      payment_link: null,
      open_chat_url: input.contactType === 'kakao' ? input.contactValue : null,
      booking_url: null,
      hero_image_url: null,
      profile_image_url: null,
      gallery_images: [],
      video_url: null,
      instagram_username: null,
      youtube_channel_id: null,
      kakao_talk_id: input.contactType === 'phone' ? input.contactValue : null,
      subscription_tier: 'free' as const,
      studio_id: null,
      tour_experience: null,
    };

    const { data, error } = await supabase
      .from('pro_profiles')
      .insert(profileData)
      .select('slug')
      .single();

    if (error) {
      // If slug collision, try with longer random suffix
      if (error.code === '23505') {
        const retrySlug = `${baseSlug}-${Date.now().toString(36)}`;
        const { data: retryData, error: retryError } = await supabase
          .from('pro_profiles')
          .insert({ ...profileData, slug: retrySlug })
          .select('slug')
          .single();

        if (retryError) {
          return { success: false, error: retryError.message };
        }

        revalidatePath('/dashboard');
        return { success: true, data: { slug: retryData.slug } };
      }

      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: { slug: data.slug } };
  } catch (err) {
    console.error('createQuickProfile error:', err);
    return { success: false, error: 'Failed to create profile' };
  }
}
