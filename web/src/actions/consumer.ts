'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';

export interface ConsumerBooking {
  id: string;
  pro_id: string;
  user_id: string;
  start_at: string;
  end_at: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  price_amount: number | null;
  price_currency: string;
  customer_notes: string | null;
  created_at: string;
  // Pro info from join
  pro: {
    id: string;
    title: string;
    slug: string;
    profile_image_url: string | null;
    location: string | null;
  };
}

/**
 * Get current user's bookings with pro profile info
 */
export async function getConsumerBookings(): Promise<ActionResult<ConsumerBooking[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        pro_id,
        user_id,
        start_at,
        end_at,
        status,
        payment_status,
        price_amount,
        price_currency,
        customer_notes,
        created_at,
        pro_profiles!bookings_pro_id_fkey (
          id,
          title,
          slug,
          profile_image_url,
          location
        )
      `)
      .eq('user_id', user.id)
      .order('start_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    // Transform the data to match our interface
    const bookings: ConsumerBooking[] = (data || []).map((booking) => {
      // Supabase join returns the relation - handle both array and object cases
      const proProfile = Array.isArray(booking.pro_profiles)
        ? booking.pro_profiles[0]
        : booking.pro_profiles;

      return {
        id: booking.id,
        pro_id: booking.pro_id,
        user_id: booking.user_id,
        start_at: booking.start_at,
        end_at: booking.end_at,
        status: booking.status,
        payment_status: booking.payment_status,
        price_amount: booking.price_amount,
        price_currency: booking.price_currency,
        customer_notes: booking.customer_notes,
        created_at: booking.created_at,
        pro: proProfile as ConsumerBooking['pro'],
      };
    });

    return { success: true, data: bookings };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

/**
 * Get current user's profile info
 */
export async function getConsumerProfile(): Promise<ActionResult<{
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
}>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, phone')
      .eq('id', user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        id: data.id,
        full_name: data.full_name || '',
        email: user.email || '',
        avatar_url: data.avatar_url,
        phone: data.phone,
      },
    };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch profile' };
  }
}

/**
 * Get consumer stats (booking count, etc.)
 */
export async function getConsumerStats(): Promise<ActionResult<{
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
}>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const now = new Date().toISOString();

    // Get all bookings count
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get upcoming bookings count
    const { count: upcomingBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['pending', 'confirmed'])
      .gte('start_at', now);

    // Get completed bookings count
    const { count: completedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    return {
      success: true,
      data: {
        totalBookings: totalBookings || 0,
        upcomingBookings: upcomingBookings || 0,
        completedBookings: completedBookings || 0,
      },
    };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch stats' };
  }
}

export interface SavedPro {
  id: string;
  pro_id: string;
  created_at: string;
  pro: {
    id: string;
    title: string;
    slug: string;
    profile_image_url: string | null;
    location: string | null;
    bio: string | null;
    rating: number | null;
  };
}

/**
 * Get user's saved/favorite pros
 */
export async function getSavedPros(): Promise<ActionResult<SavedPro[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('saved_pros')
      .select(`
        id,
        pro_id,
        created_at,
        pro_profiles!saved_pros_pro_id_fkey (
          id,
          title,
          slug,
          profile_image_url,
          location,
          bio,
          rating
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const savedPros: SavedPro[] = (data || []).map((item) => {
      const proProfile = Array.isArray(item.pro_profiles)
        ? item.pro_profiles[0]
        : item.pro_profiles;

      return {
        id: item.id,
        pro_id: item.pro_id,
        created_at: item.created_at,
        pro: proProfile as SavedPro['pro'],
      };
    });

    return { success: true, data: savedPros };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch saved pros' };
  }
}

/**
 * Save a pro to favorites
 */
export async function savePro(proId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('saved_pros')
      .insert({ user_id: user.id, pro_id: proId })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Pro already saved' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: { id: data.id } };
  } catch (_err) {
    return { success: false, error: 'Failed to save pro' };
  }
}

/**
 * Remove a pro from favorites
 */
export async function unsavePro(proId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('saved_pros')
      .delete()
      .eq('user_id', user.id)
      .eq('pro_id', proId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (_err) {
    return { success: false, error: 'Failed to unsave pro' };
  }
}

/**
 * Check if a pro is saved by the current user
 */
export async function isProSaved(proId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, data: false };
    }

    const { data, error } = await supabase
      .from('saved_pros')
      .select('id')
      .eq('user_id', user.id)
      .eq('pro_id', proId)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: !!data };
  } catch (_err) {
    return { success: false, error: 'Failed to check saved status' };
  }
}

export interface ConsumerConsultation {
  id: string;
  pro_id: string;
  name: string;
  phone: string;
  message: string | null;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  pro: {
    id: string;
    title: string;
    slug: string;
    profile_image_url: string | null;
  };
}

/**
 * Get user's consultation requests
 */
export async function getConsumerConsultations(): Promise<ActionResult<ConsumerConsultation[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('consultation_requests')
      .select(`
        id,
        pro_id,
        name,
        phone,
        message,
        status,
        created_at,
        pro_profiles!consultation_requests_pro_id_fkey (
          id,
          title,
          slug,
          profile_image_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const consultations: ConsumerConsultation[] = (data || []).map((item) => {
      const proProfile = Array.isArray(item.pro_profiles)
        ? item.pro_profiles[0]
        : item.pro_profiles;

      return {
        id: item.id,
        pro_id: item.pro_id,
        name: item.name,
        phone: item.phone,
        message: item.message,
        status: item.status,
        created_at: item.created_at,
        pro: proProfile as ConsumerConsultation['pro'],
      };
    });

    return { success: true, data: consultations };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch consultations' };
  }
}

/**
 * Get completed lessons (bookings with status = 'completed')
 */
export async function getCompletedLessons(): Promise<ActionResult<ConsumerBooking[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        pro_id,
        user_id,
        start_at,
        end_at,
        status,
        payment_status,
        price_amount,
        price_currency,
        customer_notes,
        created_at,
        pro_profiles!bookings_pro_id_fkey (
          id,
          title,
          slug,
          profile_image_url,
          location
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('start_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const bookings: ConsumerBooking[] = (data || []).map((booking) => {
      const proProfile = Array.isArray(booking.pro_profiles)
        ? booking.pro_profiles[0]
        : booking.pro_profiles;

      return {
        id: booking.id,
        pro_id: booking.pro_id,
        user_id: booking.user_id,
        start_at: booking.start_at,
        end_at: booking.end_at,
        status: booking.status,
        payment_status: booking.payment_status,
        price_amount: booking.price_amount,
        price_currency: booking.price_currency,
        customer_notes: booking.customer_notes,
        created_at: booking.created_at,
        pro: proProfile as ConsumerBooking['pro'],
      };
    });

    return { success: true, data: bookings };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch lessons' };
  }
}
