'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from './types';

// ============================================
// Types
// ============================================

export interface LessonLog {
  id: string;
  booking_id: string | null;
  pro_id: string;
  student_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  lesson_date: string;
  duration_minutes: number;
  lesson_type: string | null;
  topic: string | null;
  notes: string | null;
  homework: string | null;
  metrics: Record<string, number>;
  skill_level: string | null;
  progress_notes: string | null;
  is_shared_with_student: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonMedia {
  id: string;
  lesson_log_id: string;
  media_type: 'image' | 'video';
  url: string;
  thumbnail_url: string | null;
  storage_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  duration_seconds: number | null;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  display_order: number;
  created_at: string;
}

export interface LessonLogWithMedia extends LessonLog {
  media: LessonMedia[];
}

export interface CreateLessonLogInput {
  bookingId?: string;
  studentId?: string;
  guestName?: string;
  guestPhone?: string;
  lessonDate: string;
  durationMinutes?: number;
  lessonType?: string;
  topic?: string;
  notes?: string;
  homework?: string;
  metrics?: Record<string, number>;
  skillLevel?: string;
  progressNotes?: string;
  isSharedWithStudent?: boolean;
}

export interface UpdateLessonLogInput {
  lessonDate?: string;
  durationMinutes?: number;
  lessonType?: string;
  topic?: string;
  notes?: string;
  homework?: string;
  metrics?: Record<string, number>;
  skillLevel?: string;
  progressNotes?: string;
  isSharedWithStudent?: boolean;
}

export interface AddMediaInput {
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  storagePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  durationSeconds?: number;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface LessonStats {
  total_lessons: number;
  total_students: number;
  total_hours: number;
  this_month_lessons: number;
}

// ============================================
// Pro Profile Helper
// ============================================

async function getProProfileId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: proProfile } = await supabase
    .from('pro_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  return proProfile?.id || null;
}

// ============================================
// Lesson Log CRUD
// ============================================

/**
 * Create a new lesson log
 */
export async function createLessonLog(
  input: CreateLessonLogInput
): Promise<ActionResult<LessonLog>> {
  try {
    const supabase = await createClient();
    const proId = await getProProfileId();

    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    // Validate student or guest
    if (!input.studentId && !input.guestName) {
      return { success: false, error: '수강생 정보가 필요합니다.' };
    }

    const { data, error } = await supabase
      .from('lesson_logs')
      .insert({
        pro_id: proId,
        booking_id: input.bookingId || null,
        student_id: input.studentId || null,
        guest_name: input.guestName || null,
        guest_phone: input.guestPhone || null,
        lesson_date: input.lessonDate,
        duration_minutes: input.durationMinutes || 60,
        lesson_type: input.lessonType || null,
        topic: input.topic || null,
        notes: input.notes || null,
        homework: input.homework || null,
        metrics: input.metrics || {},
        skill_level: input.skillLevel || null,
        progress_notes: input.progressNotes || null,
        is_shared_with_student: input.isSharedWithStudent ?? true,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/lessons');
    return { success: true, data: data as LessonLog };
  } catch {
    return { success: false, error: '레슨 일지 생성에 실패했습니다.' };
  }
}

/**
 * Get a lesson log by ID with media
 */
export async function getLessonLog(
  id: string
): Promise<ActionResult<LessonLogWithMedia>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('lesson_logs')
      .select(`
        *,
        media:lesson_media(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LessonLogWithMedia };
  } catch {
    return { success: false, error: '레슨 일지 조회에 실패했습니다.' };
  }
}

/**
 * Get all lesson logs for the current pro
 */
export async function getMyLessonLogs(options?: {
  studentId?: string;
  guestName?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<LessonLog[]>> {
  try {
    const supabase = await createClient();
    const proId = await getProProfileId();

    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    let query = supabase
      .from('lesson_logs')
      .select('*')
      .eq('pro_id', proId)
      .order('lesson_date', { ascending: false });

    if (options?.studentId) {
      query = query.eq('student_id', options.studentId);
    }

    if (options?.guestName) {
      query = query.eq('guest_name', options.guestName);
    }

    if (options?.startDate) {
      query = query.gte('lesson_date', options.startDate);
    }

    if (options?.endDate) {
      query = query.lte('lesson_date', options.endDate);
    }

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

    return { success: true, data: data as LessonLog[] };
  } catch {
    return { success: false, error: '레슨 일지 목록 조회에 실패했습니다.' };
  }
}

/**
 * Update a lesson log
 */
export async function updateLessonLog(
  id: string,
  input: UpdateLessonLogInput
): Promise<ActionResult<LessonLog>> {
  try {
    const supabase = await createClient();
    const proId = await getProProfileId();

    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    const updateData: Record<string, unknown> = {};

    if (input.lessonDate !== undefined) updateData.lesson_date = input.lessonDate;
    if (input.durationMinutes !== undefined) updateData.duration_minutes = input.durationMinutes;
    if (input.lessonType !== undefined) updateData.lesson_type = input.lessonType;
    if (input.topic !== undefined) updateData.topic = input.topic;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.homework !== undefined) updateData.homework = input.homework;
    if (input.metrics !== undefined) updateData.metrics = input.metrics;
    if (input.skillLevel !== undefined) updateData.skill_level = input.skillLevel;
    if (input.progressNotes !== undefined) updateData.progress_notes = input.progressNotes;
    if (input.isSharedWithStudent !== undefined)
      updateData.is_shared_with_student = input.isSharedWithStudent;

    const { data, error } = await supabase
      .from('lesson_logs')
      .update(updateData)
      .eq('id', id)
      .eq('pro_id', proId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/lessons');
    revalidatePath(`/dashboard/lessons/${id}`);
    return { success: true, data: data as LessonLog };
  } catch {
    return { success: false, error: '레슨 일지 수정에 실패했습니다.' };
  }
}

/**
 * Delete a lesson log
 */
export async function deleteLessonLog(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const proId = await getProProfileId();

    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    const { error } = await supabase
      .from('lesson_logs')
      .delete()
      .eq('id', id)
      .eq('pro_id', proId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/lessons');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: '레슨 일지 삭제에 실패했습니다.' };
  }
}

// ============================================
// Lesson Media CRUD
// ============================================

/**
 * Add media to a lesson log
 */
export async function addLessonMedia(
  lessonLogId: string,
  input: AddMediaInput
): Promise<ActionResult<LessonMedia>> {
  try {
    const supabase = await createClient();

    // Verify ownership
    const proId = await getProProfileId();
    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    const { data: lessonLog } = await supabase
      .from('lesson_logs')
      .select('id')
      .eq('id', lessonLogId)
      .eq('pro_id', proId)
      .single();

    if (!lessonLog) {
      return { success: false, error: '레슨 일지를 찾을 수 없습니다.' };
    }

    // Get max display order
    const { data: maxOrderData } = await supabase
      .from('lesson_media')
      .select('display_order')
      .eq('lesson_log_id', lessonLogId)
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const displayOrder = (maxOrderData?.display_order || 0) + 1;

    const { data, error } = await supabase
      .from('lesson_media')
      .insert({
        lesson_log_id: lessonLogId,
        media_type: input.mediaType,
        url: input.url,
        thumbnail_url: input.thumbnailUrl || null,
        storage_path: input.storagePath || null,
        file_name: input.fileName || null,
        file_size: input.fileSize || null,
        mime_type: input.mimeType || null,
        duration_seconds: input.durationSeconds || null,
        title: input.title || null,
        description: input.description || null,
        tags: input.tags || null,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/lessons/${lessonLogId}`);
    return { success: true, data: data as LessonMedia };
  } catch {
    return { success: false, error: '미디어 추가에 실패했습니다.' };
  }
}

/**
 * Delete media from a lesson log
 */
export async function deleteLessonMedia(
  mediaId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    // Get media to find lesson log
    const { data: media } = await supabase
      .from('lesson_media')
      .select('lesson_log_id')
      .eq('id', mediaId)
      .single();

    if (!media) {
      return { success: false, error: '미디어를 찾을 수 없습니다.' };
    }

    // Verify ownership
    const proId = await getProProfileId();
    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    const { data: lessonLog } = await supabase
      .from('lesson_logs')
      .select('id')
      .eq('id', media.lesson_log_id)
      .eq('pro_id', proId)
      .single();

    if (!lessonLog) {
      return { success: false, error: '레슨 일지를 찾을 수 없습니다.' };
    }

    const { error } = await supabase.from('lesson_media').delete().eq('id', mediaId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/lessons/${media.lesson_log_id}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: '미디어 삭제에 실패했습니다.' };
  }
}

// ============================================
// Statistics
// ============================================

/**
 * Get lesson statistics for the current pro
 */
export async function getLessonStats(): Promise<ActionResult<LessonStats>> {
  try {
    const supabase = await createClient();
    const proId = await getProProfileId();

    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    const { data, error } = await supabase.rpc('get_pro_lesson_stats', {
      p_pro_id: proId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as LessonStats };
  } catch {
    return { success: false, error: '통계 조회에 실패했습니다.' };
  }
}

/**
 * Get unique students for the current pro
 */
export async function getMyStudents(): Promise<
  ActionResult<Array<{ id: string | null; name: string; lessonCount: number }>>
> {
  try {
    const supabase = await createClient();
    const proId = await getProProfileId();

    if (!proId) {
      return { success: false, error: '프로 프로필을 찾을 수 없습니다.' };
    }

    // Get registered students
    const { data: registeredStudents } = await supabase
      .from('lesson_logs')
      .select(`
        student_id,
        profiles!lesson_logs_student_id_fkey(id, username, full_name)
      `)
      .eq('pro_id', proId)
      .not('student_id', 'is', null);

    // Get guest students
    const { data: guestStudents } = await supabase
      .from('lesson_logs')
      .select('guest_name')
      .eq('pro_id', proId)
      .not('guest_name', 'is', null);

    // Count lessons per student
    const studentMap = new Map<string, { id: string | null; name: string; count: number }>();

    registeredStudents?.forEach((log) => {
      const profileData = log.profiles as unknown;
      const profile = profileData as { id: string; username: string; full_name: string } | null;
      if (profile) {
        const key = `registered-${profile.id}`;
        const existing = studentMap.get(key);
        studentMap.set(key, {
          id: profile.id,
          name: profile.full_name || profile.username,
          count: (existing?.count || 0) + 1,
        });
      }
    });

    guestStudents?.forEach((log) => {
      if (log.guest_name) {
        const key = `guest-${log.guest_name}`;
        const existing = studentMap.get(key);
        studentMap.set(key, {
          id: null,
          name: log.guest_name,
          count: (existing?.count || 0) + 1,
        });
      }
    });

    const students = Array.from(studentMap.values()).map((s) => ({
      id: s.id,
      name: s.name,
      lessonCount: s.count,
    }));

    students.sort((a, b) => b.lessonCount - a.lessonCount);

    return { success: true, data: students };
  } catch {
    return { success: false, error: '수강생 목록 조회에 실패했습니다.' };
  }
}
