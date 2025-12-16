'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from './types';

/**
 * Studio type from database
 */
export type Studio = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  location: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  kakao_channel_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type StudioInsert = Omit<Studio, 'id' | 'created_at' | 'updated_at'>;
export type StudioUpdate = Partial<Omit<Studio, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>;

/**
 * Create a new studio (team/academy page)
 */
export async function createStudio(
  studioData: Omit<StudioInsert, 'owner_id' | 'slug'>
): Promise<ActionResult<Studio>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Generate slug from name
    const slug = studioData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('studios')
      .insert({
        ...studioData,
        owner_id: user.id,
        slug,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/studio');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to create studio' };
  }
}

/**
 * Get studio by slug (public)
 */
export async function getPublicStudio(
  slug: string
): Promise<ActionResult<Studio | null>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch studio' };
  }
}

/**
 * Get current user's studios
 */
export async function getMyStudios(): Promise<ActionResult<Studio[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch studios' };
  }
}

/**
 * Update studio
 */
export async function updateStudio(
  studioId: string,
  updates: StudioUpdate
): Promise<ActionResult<Studio>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('studios')
      .update(updates)
      .eq('id', studioId)
      .eq('owner_id', user.id) // RLS backup
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/studio/${data.slug}`);
    revalidatePath('/dashboard/studio');

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to update studio' };
  }
}

/**
 * Add a pro to a studio
 */
export async function addProToStudio(
  studioId: string,
  proProfileId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify user owns the studio
    const { data: studio, error: studioError } = await supabase
      .from('studios')
      .select('id, slug')
      .eq('id', studioId)
      .eq('owner_id', user.id)
      .single();

    if (studioError || !studio) {
      return { success: false, error: 'Studio not found or unauthorized' };
    }

    // Update pro profile with studio association
    const { error } = await supabase
      .from('pro_profiles')
      .update({ studio_id: studioId })
      .eq('id', proProfileId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/studio/${studio.slug}`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to add pro to studio' };
  }
}

/**
 * Get pros in a studio
 */
export async function getStudioPros(
  studioId: string
): Promise<ActionResult<{ id: string; slug: string; title: string; profile_image_url: string | null }[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pro_profiles')
      .select('id, slug, title, profile_image_url')
      .eq('studio_id', studioId)
      .eq('is_approved', true);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch studio pros' };
  }
}
