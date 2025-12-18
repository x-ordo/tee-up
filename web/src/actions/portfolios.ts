'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult, ThemeType } from './types';
import { DEFAULT_SECTIONS } from '@/lib/portfolio-constants';

/**
 * Portfolio section type from database
 */
export type PortfolioSection = {
  id: string;
  pro_profile_id: string;
  section_type: string;
  title: string | null;
  content: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type PortfolioSectionInsert = Omit<PortfolioSection, 'id' | 'created_at' | 'updated_at'>;
export type PortfolioSectionUpdate = Partial<Omit<PortfolioSection, 'id' | 'pro_profile_id' | 'created_at' | 'updated_at'>>;

/**
 * Update portfolio theme type
 */
export async function updatePortfolioTheme(
  profileId: string,
  themeType: ThemeType
): Promise<ActionResult<{ theme_type: ThemeType; slug: string }>> {
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
      .update({ theme_type: themeType })
      .eq('id', profileId)
      .eq('user_id', user.id)
      .select('theme_type, slug')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${data.slug}`);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to update theme' };
  }
}

/**
 * Get portfolio sections for a profile
 */
export async function getPortfolioSections(
  profileId: string
): Promise<ActionResult<PortfolioSection[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('portfolio_sections')
      .select('*')
      .eq('pro_profile_id', profileId)
      .order('display_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch portfolio sections' };
  }
}

/**
 * Create a portfolio section
 */
export async function createPortfolioSection(
  sectionData: Omit<PortfolioSectionInsert, 'is_visible'>
): Promise<ActionResult<PortfolioSection>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const { data: profile, error: profileError } = await supabase
      .from('pro_profiles')
      .select('id, slug')
      .eq('id', sectionData.pro_profile_id)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found or unauthorized' };
    }

    const { data, error } = await supabase
      .from('portfolio_sections')
      .insert({
        ...sectionData,
        is_visible: true,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${profile.slug}`);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to create section' };
  }
}

/**
 * Update a portfolio section
 */
export async function updatePortfolioSection(
  sectionId: string,
  updates: PortfolioSectionUpdate
): Promise<ActionResult<PortfolioSection>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get section with profile to verify ownership
    const { data: section, error: sectionError } = await supabase
      .from('portfolio_sections')
      .select('*, pro_profiles!inner(user_id, slug)')
      .eq('id', sectionId)
      .single();

    if (sectionError || !section) {
      return { success: false, error: 'Section not found' };
    }

    // Verify ownership
    if (section.pro_profiles.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
      .from('portfolio_sections')
      .update(updates)
      .eq('id', sectionId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${section.pro_profiles.slug}`);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to update section' };
  }
}

/**
 * Delete a portfolio section
 */
export async function deletePortfolioSection(
  sectionId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get section with profile to verify ownership
    const { data: section, error: sectionError } = await supabase
      .from('portfolio_sections')
      .select('*, pro_profiles!inner(user_id, slug)')
      .eq('id', sectionId)
      .single();

    if (sectionError || !section) {
      return { success: false, error: 'Section not found' };
    }

    if (section.pro_profiles.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('portfolio_sections')
      .delete()
      .eq('id', sectionId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${section.pro_profiles.slug}`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to delete section' };
  }
}

/**
 * Reorder portfolio sections
 */
export async function reorderPortfolioSections(
  profileId: string,
  sectionIds: string[]
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const { data: profile, error: profileError } = await supabase
      .from('pro_profiles')
      .select('id, slug')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found or unauthorized' };
    }

    // Update display order for each section
    const updates = sectionIds.map((sectionId, index) =>
      supabase
        .from('portfolio_sections')
        .update({ display_order: index })
        .eq('id', sectionId)
        .eq('pro_profile_id', profileId)
    );

    await Promise.all(updates);

    revalidatePath(`/${profile.slug}`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to reorder sections' };
  }
}

/**
 * Update payment link
 */
export async function updatePaymentLink(
  profileId: string,
  paymentLink: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate URL format
    try {
      new URL(paymentLink);
    } catch {
      return { success: false, error: 'Invalid URL format' };
    }

    const { error } = await supabase
      .from('pro_profiles')
      .update({ payment_link: paymentLink })
      .eq('id', profileId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to update payment link' };
  }
}

/**
 * Update KakaoTalk open chat URL
 */
export async function updateOpenChatUrl(
  profileId: string,
  openChatUrl: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate Kakao open chat URL format
    if (openChatUrl && !openChatUrl.includes('open.kakao.com')) {
      return { success: false, error: 'Invalid KakaoTalk open chat URL' };
    }

    const { error } = await supabase
      .from('pro_profiles')
      .update({ open_chat_url: openChatUrl })
      .eq('id', profileId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to update open chat URL' };
  }
}

/**
 * Initialize default sections for a profile based on theme
 */
export async function initializeDefaultSections(
  profileId: string,
  themeType: ThemeType
): Promise<ActionResult<PortfolioSection[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const { data: profile, error: profileError } = await supabase
      .from('pro_profiles')
      .select('id, slug')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found or unauthorized' };
    }

    const defaultSections = DEFAULT_SECTIONS[themeType];

    const sectionsToInsert = defaultSections.map((section, index) => ({
      pro_profile_id: profileId,
      section_type: section.section_type,
      title: section.title,
      content: {},
      display_order: index,
      is_visible: true,
    }));

    const { data, error } = await supabase
      .from('portfolio_sections')
      .insert(sectionsToInsert)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${profile.slug}`);
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to initialize sections' };
  }
}
