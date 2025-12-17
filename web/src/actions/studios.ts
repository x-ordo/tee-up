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

// ============================================
// Studio Members & Dashboard
// ============================================

export type StudioMember = {
  id: string;
  studio_id: string;
  pro_profile_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  invited_by: string | null;
  pro_profile?: {
    id: string;
    slug: string;
    title: string;
    profile_image_url: string | null;
  };
};

export type StudioInvite = {
  id: string;
  studio_id: string;
  token: string;
  created_by: string;
  email: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  max_uses: number | null;
  use_count: number;
  created_at: string;
};

export type StudioDashboardStats = {
  total_members: number;
  bookings_this_month: number;
  revenue_estimate: number;
  members: {
    pro_profile_id: string;
    pro_name: string;
    pro_slug: string;
    profile_image_url: string | null;
    role: 'owner' | 'member';
    joined_at: string;
    bookings_this_month: number;
    revenue_estimate: number;
  }[];
};

/**
 * Get studio by ID (for dashboard)
 */
export async function getStudioById(
  studioId: string
): Promise<ActionResult<Studio | null>> {
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
      .eq('id', studioId)
      .eq('owner_id', user.id)
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
 * Get studio dashboard stats
 */
export async function getStudioDashboardStats(
  studioId: string
): Promise<ActionResult<StudioDashboardStats>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Call the database function
    const { data, error } = await supabase.rpc('get_studio_dashboard_stats', {
      p_studio_id: studioId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || 'Failed to get stats' };
    }

    return {
      success: true,
      data: {
        total_members: data.total_members,
        bookings_this_month: data.bookings_this_month,
        revenue_estimate: data.revenue_estimate,
        members: data.members || [],
      },
    };
  } catch (err) {
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}

/**
 * Get studio members
 */
export async function getStudioMembers(
  studioId: string
): Promise<ActionResult<StudioMember[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('studio_members')
      .select(`
        *,
        pro_profile:pro_profiles(id, slug, title, profile_image_url)
      `)
      .eq('studio_id', studioId)
      .order('role', { ascending: true })
      .order('joined_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch studio members' };
  }
}

/**
 * Remove a member from studio
 */
export async function removeStudioMember(
  studioId: string,
  memberId: string
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

    // Get member info before deleting
    const { data: member, error: memberError } = await supabase
      .from('studio_members')
      .select('pro_profile_id, role')
      .eq('id', memberId)
      .eq('studio_id', studioId)
      .single();

    if (memberError || !member) {
      return { success: false, error: 'Member not found' };
    }

    if (member.role === 'owner') {
      return { success: false, error: 'Cannot remove studio owner' };
    }

    // Delete membership
    const { error: deleteError } = await supabase
      .from('studio_members')
      .delete()
      .eq('id', memberId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Clear studio_id from pro_profile
    await supabase
      .from('pro_profiles')
      .update({ studio_id: null })
      .eq('id', member.pro_profile_id);

    revalidatePath(`/studio/${studio.slug}/dashboard`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to remove member' };
  }
}

// ============================================
// Invite System
// ============================================

/**
 * Create an invite link for the studio
 */
export async function createStudioInvite(
  studioId: string,
  options?: {
    email?: string;
    maxUses?: number;
    expiresInDays?: number;
  }
): Promise<ActionResult<StudioInvite>> {
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
      .select('id')
      .eq('id', studioId)
      .eq('owner_id', user.id)
      .single();

    if (studioError || !studio) {
      return { success: false, error: 'Studio not found or unauthorized' };
    }

    // Generate token using database function
    const { data: tokenData, error: tokenError } = await supabase.rpc(
      'generate_invite_token'
    );

    if (tokenError || !tokenData) {
      return { success: false, error: 'Failed to generate invite token' };
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (options?.expiresInDays || 7));

    const { data, error } = await supabase
      .from('studio_invites')
      .insert({
        studio_id: studioId,
        token: tokenData,
        created_by: user.id,
        email: options?.email || null,
        max_uses: options?.maxUses || 1,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to create invite' };
  }
}

/**
 * Get all invites for a studio
 */
export async function getStudioInvites(
  studioId: string
): Promise<ActionResult<StudioInvite[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('studio_invites')
      .select('*')
      .eq('studio_id', studioId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch invites' };
  }
}

/**
 * Revoke an invite
 */
export async function revokeStudioInvite(
  inviteId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('studio_invites')
      .update({ status: 'revoked' })
      .eq('id', inviteId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: 'Failed to revoke invite' };
  }
}

/**
 * Validate an invite token (public)
 */
export async function validateStudioInvite(
  token: string
): Promise<ActionResult<{ studio: Studio; invite: StudioInvite } | null>> {
  try {
    const supabase = await createClient();

    const { data: invite, error: inviteError } = await supabase
      .from('studio_invites')
      .select('*, studio:studios(*)')
      .eq('token', token)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (inviteError || !invite) {
      return { success: true, data: null };
    }

    // Check max uses
    if (invite.max_uses !== null && invite.use_count >= invite.max_uses) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        studio: invite.studio,
        invite: {
          id: invite.id,
          studio_id: invite.studio_id,
          token: invite.token,
          created_by: invite.created_by,
          email: invite.email,
          status: invite.status,
          expires_at: invite.expires_at,
          max_uses: invite.max_uses,
          use_count: invite.use_count,
          created_at: invite.created_at,
        },
      },
    };
  } catch (err) {
    return { success: false, error: 'Failed to validate invite' };
  }
}

/**
 * Accept an invite (join studio)
 */
export async function acceptStudioInvite(
  token: string
): Promise<ActionResult<{ studioId: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get user's pro profile
    const { data: proProfile, error: profileError } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !proProfile) {
      return { success: false, error: 'Pro profile required to join a studio' };
    }

    // Use the database function to validate and accept
    const { data, error } = await supabase.rpc('use_studio_invite', {
      p_token: token,
      p_pro_profile_id: proProfile.id,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || 'Failed to accept invite' };
    }

    revalidatePath('/dashboard');
    return { success: true, data: { studioId: data.studio_id } };
  } catch (err) {
    return { success: false, error: 'Failed to accept invite' };
  }
}
