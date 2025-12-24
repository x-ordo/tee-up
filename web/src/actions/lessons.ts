'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './types';

// Based on supabase/migrations/015_add_lesson_logs.sql
// This defines the core data structure for a lesson log.
export type LessonLog = {
  id: string;
  booking_id: string | null;
  pro_id: string;
  student_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  lesson_date: string;
  duration_minutes: number | null;
  lesson_type: string | null;
  topic: string | null;
  notes: string | null;
  homework: string | null;
  metrics: Record<string, unknown> | null;
  skill_level: string | null;
  progress_notes: string | null;
  is_shared_with_student: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  student_name?: string;
  student_avatar_url?: string;
};

/**
 * Fetches lesson logs for the currently authenticated pro user.
 * It also joins student's profile to get their name.
 */
export async function getMyLessonLogs(options?: {
  limit?: number;
  offset?: number;
}): Promise<ActionResult<LessonLog[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // First, get the pro profile id for the current user.
    const { data: profile, error: profileError } = await supabase
      .from('pro_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Pro profile not found' };
    }

    // Fetch lesson logs and join with profiles to get student names.
    // The query is constructed to match the LessonLog type.
    let query = supabase
      .from('lesson_logs')
      .select(`
        *,
        student:profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('pro_id', profile.id)
      .order('lesson_date', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    // Map the data to the LessonLog type, flattening the student info.
    const lessonLogs: LessonLog[] = data.map((log: any) => ({
      ...log,
      student_name: log.student?.full_name,
      student_avatar_url: log.student?.avatar_url,
      student: undefined, // Remove the nested student object
    }));

    return { success: true, data: lessonLogs };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { success: false, error: `Failed to fetch lesson logs: ${errorMessage}` };
  }
}
