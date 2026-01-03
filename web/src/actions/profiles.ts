'use server';

import { createClient, createPublicClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import type { ActionResult, ThemeType } from './types';
import {
  createCachedPublicProfile,
  createCachedApprovedProfiles,
  profileTag,
  APPROVED_PROFILES_TAG,
  CACHE_TTL,
} from '@/lib/cache';
import type { ThemeConfig } from './theme';
import {
  logError,
  addActionBreadcrumb,
  AUTH_NOT_AUTHENTICATED,
  DB_QUERY_FAILED,
  PROFILE_CREATE_FAILED,
  PROFILE_UPDATE_FAILED,
} from '@/lib/errors';
import {
  validateInput,
  quickProfileInputSchema,
  proProfileUpdateSchema,
  proProfileCreateSchema,
} from '@/lib/validations';

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
  birth_date: string | null;
  verification_file_url: string | null;
  primary_region: string | null;
  primary_city: string | null;
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
  | 'id'
  | 'profile_views'
  | 'monthly_lead_count'
  | 'total_leads'
  | 'matched_lessons'
  | 'rating'
  | 'is_approved'
  | 'is_featured'
  | 'created_at'
  | 'updated_at'
  | 'birth_date'
  | 'verification_file_url'
  | 'primary_region'
  | 'primary_city'
> & {
  birth_date?: string | null;
  verification_file_url?: string | null;
  primary_region?: string | null;
  primary_city?: string | null;
};

export type ProProfileUpdate = Partial<
  Omit<ProProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUserProfile(): Promise<ActionResult<ProProfile | null>> {
  addActionBreadcrumb('getCurrentUserProfile');

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: AUTH_NOT_AUTHENTICATED };
    }

    const { data, error } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // PGRST116 = no rows found (expected for new users)
    if (error && error.code !== 'PGRST116') {
      logError(error, { action: 'getCurrentUserProfile', userId: user.id });
      return { success: false, error: DB_QUERY_FAILED };
    }

    return { success: true, data };
  } catch (err) {
    const errorCode = logError(err, { action: 'getCurrentUserProfile' });
    return { success: false, error: errorCode };
  }
}

/**
 * Get a public profile by slug (no auth required)
 *
 * Uses unstable_cache for 5-minute TTL caching.
 * Cache is invalidated via profileTag(slug) on profile updates.
 */
export async function getPublicProfile(
  slug: string
): Promise<ActionResult<ProProfile | null>> {
  addActionBreadcrumb('getPublicProfile', { slug });

  // Create cached fetcher for this slug
  const fetchProfile = createCachedPublicProfile(slug, async () => {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('is_approved', true)
      .single();

    if (error) {
      // PGRST116 = no rows found (profile doesn't exist or not approved)
      if (error.code === 'PGRST116') {
        return { success: true as const, data: null };
      }
      logError(error, { action: 'getPublicProfile', metadata: { slug } });
      return { success: false as const, error: DB_QUERY_FAILED };
    }

    return { success: true as const, data };
  });

  try {
    return await fetchProfile();
  } catch (err) {
    const errorCode = logError(err, { action: 'getPublicProfile', metadata: { slug } });
    return { success: false, error: errorCode };
  }
}

/**
 * Get all approved profiles (for directory)
 *
 * Uses unstable_cache for 30-minute TTL caching.
 * Cache is invalidated via APPROVED_PROFILES_TAG on profile approval/creation.
 */
export async function getApprovedProfiles(): Promise<ActionResult<ProProfile[]>> {
  // Create cached fetcher for approved profiles
  const fetchProfiles = createCachedApprovedProfiles(async () => {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('is_approved', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false as const, error: error.message };
    }

    return { success: true as const, data: data || [] };
  });

  try {
    return await fetchProfiles();
  } catch (_err) {
    return { success: false, error: 'Failed to fetch profiles' };
  }
}

export type LandingRecommendation = {
  id: string;
  slug: string;
  name: string;
  region: string;
  focus: string;
  tags: string[];
  profileImageUrl: string | null;
  rating: number | null;
  review: string | null;
  reviewer: string | null;
  testimonials: Array<{ quote: string; name?: string; rating?: number }>;
};

export async function getLandingRecommendations(
  limit = 3
): Promise<ActionResult<LandingRecommendation[]>> {
  const fetchRecommendations = unstable_cache(async () => {
    const supabase = createPublicClient();

    const { data: profiles, error } = await supabase
      .from('pro_profiles')
      .select(
        'id, slug, title, location, primary_region, primary_city, specialties, certifications, profile_image_url, hero_image_url, rating'
      )
      .eq('is_approved', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false as const, error: error.message };
    }

    const profileList = profiles || [];
    const profileIds = profileList.map((profile) => profile.id);
    const testimonialsByProfile = new Map<
      string,
      Array<{ quote: string; name?: string; rating?: number }>
    >();

    if (profileIds.length > 0) {
      const { data: sections } = await supabase
        .from('portfolio_sections')
        .select('pro_profile_id, content')
        .eq('section_type', 'testimonials')
        .in('pro_profile_id', profileIds);

      sections?.forEach((section) => {
        const content = section.content as unknown;
        let parsed: Record<string, unknown> | null = null;

        if (typeof content === 'string') {
          try {
            parsed = JSON.parse(content);
          } catch {
            parsed = null;
          }
        } else if (typeof content === 'object' && content !== null) {
          parsed = content as Record<string, unknown>;
        }

        const rawTestimonials = parsed?.testimonials;
        let testimonials: Array<Record<string, unknown>> = [];

        if (typeof rawTestimonials === 'string') {
          try {
            const parsedTestimonials = JSON.parse(rawTestimonials);
            if (Array.isArray(parsedTestimonials)) {
              testimonials = parsedTestimonials;
            }
          } catch {
            testimonials = [];
          }
        } else if (Array.isArray(rawTestimonials)) {
          testimonials = rawTestimonials as Array<Record<string, unknown>>;
        }

        const mapped = testimonials
          .map((item) => {
            const quote = typeof item.quote === 'string'
              ? item.quote
              : typeof item.content === 'string'
                ? item.content
                : '';
            const name = typeof item.name === 'string' ? item.name : undefined;
            const rating = typeof item.rating === 'number'
              ? item.rating
              : typeof item.rating === 'string' && !Number.isNaN(Number(item.rating))
                ? Number(item.rating)
                : undefined;
            return { quote: quote.trim(), name, rating };
          })
          .filter((item) => item.quote.length > 0)
          .slice(0, 3);

        if (mapped.length > 0 && !testimonialsByProfile.has(section.pro_profile_id)) {
          testimonialsByProfile.set(section.pro_profile_id, mapped);
        }
      });
    }

    const recommendations: LandingRecommendation[] = profileList.map((profile) => {
      const regionParts = [profile.primary_region, profile.primary_city].filter(Boolean);
      const region = regionParts.length
        ? `${regionParts[0]}${regionParts[1] ? ` · ${regionParts[1]}` : ''}`
        : profile.location || '활동 지역 확인 중';
      const specialties = profile.specialties ?? [];
      const certifications = profile.certifications ?? [];
      const focus = profile.title || specialties[0] || '맞춤 레슨';
      const tagsSource = specialties.length > 0 ? specialties : certifications;
      const tags = tagsSource.slice(0, 3);
      const testimonialList = testimonialsByProfile.get(profile.id) ?? [];
      const testimonial = testimonialList[0];

      return {
        id: profile.id,
        slug: profile.slug,
        name: profile.title || profile.slug,
        region,
        focus,
        tags: tags.length ? tags : ['운영팀 검증', '추천 매칭'],
        profileImageUrl: profile.profile_image_url || profile.hero_image_url || null,
        rating: profile.rating || testimonial?.rating || null,
        review: testimonial?.quote || null,
        reviewer: testimonial?.name || null,
        testimonials: testimonialList,
      };
    });

    return { success: true as const, data: recommendations };
  }, [`landing-recommendations-${limit}`], {
    revalidate: CACHE_TTL.APPROVED_PROFILES,
    tags: [APPROVED_PROFILES_TAG],
  });

  try {
    return await fetchRecommendations();
  } catch (_err) {
    return { success: false, error: 'Failed to fetch landing recommendations' };
  }
}

/**
 * Update a pro profile
 */
export async function updateProProfile(
  profileId: string,
  updates: ProProfileUpdate
): Promise<ActionResult<ProProfile>> {
  addActionBreadcrumb('updateProProfile', { profileId });

  try {
    // Validate inputs
    const validation = validateInput(
      proProfileUpdateSchema,
      updates,
      'updateProProfile'
    );
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: AUTH_NOT_AUTHENTICATED };
    }

    const { data, error } = await supabase
      .from('pro_profiles')
      .update(validation.data)
      .eq('id', profileId)
      .eq('user_id', user.id) // RLS backup
      .select()
      .single();

    if (error) {
      logError(error, { action: 'updateProProfile', userId: user.id, metadata: { profileId } });
      return { success: false, error: PROFILE_UPDATE_FAILED };
    }

    // Invalidate cache tags for this profile
    revalidateTag(profileTag(data.slug));
    revalidateTag(APPROVED_PROFILES_TAG);

    // Revalidate profile pages
    revalidatePath(`/${data.slug}`);
    revalidatePath('/dashboard/portfolio');

    return { success: true, data };
  } catch (err) {
    const errorCode = logError(err, { action: 'updateProProfile' });
    return { success: false, error: errorCode };
  }
}

/**
 * Create a new pro profile
 */
export async function createProProfile(
  profileData: Omit<ProProfileInsert, 'user_id'>
): Promise<ActionResult<ProProfile>> {
  addActionBreadcrumb('createProProfile');

  try {
    // Validate inputs
    const validation = validateInput(
      proProfileCreateSchema,
      profileData,
      'createProProfile'
    );
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: AUTH_NOT_AUTHENTICATED };
    }

    // Generate slug from title if not provided
    const validatedData = validation.data;
    const slug =
      validatedData.slug ||
      validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('pro_profiles')
      .insert({
        ...validatedData,
        user_id: user.id,
        slug,
      })
      .select()
      .single();

    if (error) {
      logError(error, { action: 'createProProfile', userId: user.id });
      return { success: false, error: PROFILE_CREATE_FAILED };
    }

    // Invalidate approved profiles cache when new profile is created
    revalidateTag(APPROVED_PROFILES_TAG);

    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (err) {
    const errorCode = logError(err, { action: 'createProProfile' });
    return { success: false, error: errorCode };
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
  birthDate: string;
  phoneNumber: string;
  profileImageUrl: string;
  proVerificationFileUrl: string;
  primaryRegion: string;
  primaryCity: string;
}

const REGION_LABELS: Record<string, string> = {
  seoul: '서울',
  gyeonggi: '경기',
  incheon: '인천',
  busan: '부산',
  daegu: '대구',
  gwangju: '광주',
  daejeon: '대전',
  ulsan: '울산',
  sejong: '세종',
  gangwon: '강원',
  chungbuk: '충북',
  chungnam: '충남',
  jeonbuk: '전북',
  jeonnam: '전남',
  gyeongbuk: '경북',
  gyeongnam: '경남',
  jeju: '제주',
  overseas: '해외',
};

function formatLocation(region: string, city: string) {
  const label = REGION_LABELS[region] || region;
  return `${label} ${city}`.trim();
}

/**
 * Create a quick profile for new pros (5-minute onboarding)
 * PRD v1.2: "무료 홍보 페이지 중심" 전략
 */
// ============================================
// Explore Page: Filtered Profiles
// ============================================

export type ExploreFilters = {
  region?: string;
  specialty?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'recommended' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
};

export type ExploreProfile = {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  specialties: string[];
  location: string | null;
  primaryRegion: string | null;
  primaryCity: string | null;
  profileImageUrl: string | null;
  heroImageUrl: string | null;
  rating: number;
  profileViews: number;
  totalLeads: number;
  certifications: string[];
  isFeatured: boolean;
  createdAt: string;
};

export type ExploreResult = {
  profiles: ExploreProfile[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

/**
 * Get filtered profiles for the /explore page
 * Supports filtering by region, specialty, price, and search
 * Supports pagination and various sort orders
 */
export async function getFilteredProfiles(
  filters: ExploreFilters = {}
): Promise<ActionResult<ExploreResult>> {
  addActionBreadcrumb('getFilteredProfiles', { filters });

  const {
    region,
    specialty,
    search,
    sortBy = 'recommended',
    page = 1,
    limit = 12,
  } = filters;

  try {
    const supabase = createPublicClient();

    let query = supabase
      .from('pro_profiles')
      .select(
        'id, slug, title, bio, specialties, location, primary_region, primary_city, profile_image_url, hero_image_url, rating, profile_views, total_leads, certifications, is_featured, created_at',
        { count: 'exact' }
      )
      .eq('is_approved', true);

    // Filter by region
    if (region) {
      query = query.eq('primary_region', region);
    }

    // Filter by specialty (check if specialties array contains the specialty)
    if (specialty) {
      query = query.contains('specialties', [specialty]);
    }

    // Search by title, bio, or specialties
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,bio.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('profile_views', { ascending: false });
        break;
      case 'recommended':
      default:
        // Featured first, then by rating
        query = query
          .order('is_featured', { ascending: false })
          .order('rating', { ascending: false })
          .order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      logError(error, { action: 'getFilteredProfiles', metadata: { filters } });
      return { success: false, error: DB_QUERY_FAILED };
    }

    const profiles: ExploreProfile[] = (data || []).map((profile) => ({
      id: profile.id,
      slug: profile.slug,
      title: profile.title,
      bio: profile.bio,
      specialties: profile.specialties ?? [],
      location: profile.location,
      primaryRegion: profile.primary_region,
      primaryCity: profile.primary_city,
      profileImageUrl: profile.profile_image_url,
      heroImageUrl: profile.hero_image_url,
      rating: profile.rating ?? 0,
      profileViews: profile.profile_views ?? 0,
      totalLeads: profile.total_leads ?? 0,
      certifications: profile.certifications ?? [],
      isFeatured: profile.is_featured ?? false,
      createdAt: profile.created_at,
    }));

    const total = count ?? 0;
    const hasMore = offset + profiles.length < total;

    return {
      success: true,
      data: {
        profiles,
        total,
        page,
        limit,
        hasMore,
      },
    };
  } catch (err) {
    const errorCode = logError(err, { action: 'getFilteredProfiles' });
    return { success: false, error: errorCode };
  }
}

/**
 * Get available filter options for the /explore page
 * Returns distinct regions and specialties from approved profiles
 */
export async function getExploreFilterOptions(): Promise<
  ActionResult<{
    regions: Array<{ value: string; label: string; count: number }>;
    specialties: Array<{ value: string; label: string; count: number }>;
  }>
> {
  try {
    const supabase = createPublicClient();

    // Get all approved profiles to extract unique values
    const { data, error } = await supabase
      .from('pro_profiles')
      .select('primary_region, specialties')
      .eq('is_approved', true);

    if (error) {
      return { success: false, error: error.message };
    }

    // Count regions
    const regionCounts = new Map<string, number>();
    const specialtyCounts = new Map<string, number>();

    (data || []).forEach((profile) => {
      // Count regions
      if (profile.primary_region) {
        regionCounts.set(
          profile.primary_region,
          (regionCounts.get(profile.primary_region) || 0) + 1
        );
      }

      // Count specialties
      const specialties = profile.specialties ?? [];
      specialties.forEach((specialty: string) => {
        specialtyCounts.set(specialty, (specialtyCounts.get(specialty) || 0) + 1);
      });
    });

    // Convert to arrays with labels
    const REGION_LABELS: Record<string, string> = {
      seoul: '서울',
      gyeonggi: '경기',
      incheon: '인천',
      busan: '부산',
      daegu: '대구',
      gwangju: '광주',
      daejeon: '대전',
      ulsan: '울산',
      sejong: '세종',
      gangwon: '강원',
      chungbuk: '충북',
      chungnam: '충남',
      jeonbuk: '전북',
      jeonnam: '전남',
      gyeongbuk: '경북',
      gyeongnam: '경남',
      jeju: '제주',
      overseas: '해외',
    };

    const regions = Array.from(regionCounts.entries())
      .map(([value, count]) => ({
        value,
        label: REGION_LABELS[value] || value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const specialties = Array.from(specialtyCounts.entries())
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return { success: true, data: { regions, specialties } };
  } catch (_err) {
    return { success: false, error: 'Failed to fetch filter options' };
  }
}

/**
 * Quiz answer types for pro matching
 */
export type QuizAnswers = {
  skillLevel: string;
  focusArea: string;
  lessonStyle: string;
  region: string;
  budget: string;
};

/**
 * Matched profile with match score
 */
export type MatchedProfile = ExploreProfile & {
  matchScore: number;
};

/**
 * Get matched profiles based on quiz answers
 * Returns up to 3 best-matching profiles with match scores
 */
export async function getMatchedProfiles(
  answers: QuizAnswers
): Promise<ActionResult<MatchedProfile[]>> {
  try {
    addActionBreadcrumb('getMatchedProfiles', { answers });
    const supabase = createPublicClient();

    // Build base query for approved profiles
    let query = supabase
      .from('pro_profiles')
      .select(
        `
        id,
        slug,
        title,
        bio,
        specialties,
        location,
        primary_region,
        primary_city,
        profile_image_url,
        hero_image_url,
        rating,
        profile_views,
        total_leads,
        certifications,
        is_featured,
        created_at
      `
      )
      .eq('is_approved', true);

    // Apply region filter for exact match
    const regionMap: Record<string, string[]> = {
      seoul: ['seoul'],
      gyeonggi: ['gyeonggi'],
      incheon: ['incheon'],
      busan: ['busan', 'gyeongnam'],
      other: ['daegu', 'gwangju', 'daejeon', 'ulsan', 'sejong', 'gangwon', 'chungbuk', 'chungnam', 'jeonbuk', 'jeonnam', 'gyeongbuk', 'jeju', 'overseas'],
    };

    const targetRegions = regionMap[answers.region] || [];
    if (targetRegions.length > 0) {
      query = query.in('primary_region', targetRegions);
    }

    // Order by rating and featured status
    query = query
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .limit(20);

    const { data, error } = await query;

    if (error) {
      logError(error, { action: 'getMatchedProfiles', metadata: { answers } });
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    // Calculate match scores based on quiz answers
    const focusAreaKeywords: Record<string, string[]> = {
      swing: ['스윙', '기본', '풀스윙', '자세', '폼'],
      driver: ['드라이버', '비거리', '장타', '티샷'],
      shortgame: ['숏게임', '어프로치', '웨지', '칩샷', '벙커'],
      putting: ['퍼팅', '그린', '퍼터'],
      course: ['코스', '매니지먼트', '전략', '라운딩', '멘탈'],
    };

    const lessonStyleKeywords: Record<string, string[]> = {
      systematic: ['커리큘럼', '체계', '단계별', '레벨'],
      practical: ['실전', '필드', '라운딩', '코스'],
      video: ['영상', '분석', '촬영', '스윙분석'],
      intensive: ['교정', '집중', '문제해결', '피팅'],
    };

    const scoredProfiles = data.map((profile) => {
      let score = 50; // Base score

      // Specialty matching (up to +30)
      const specialties = profile.specialties || [];
      const focusKeywords = focusAreaKeywords[answers.focusArea] || [];
      const styleKeywords = lessonStyleKeywords[answers.lessonStyle] || [];

      const allKeywords = [...focusKeywords, ...styleKeywords];
      const matchingSpecialties = specialties.filter((s: string) =>
        allKeywords.some((keyword) => s.toLowerCase().includes(keyword.toLowerCase()))
      );
      score += Math.min(30, matchingSpecialties.length * 10);

      // Region exact match (+10)
      if (profile.primary_region && targetRegions.includes(profile.primary_region)) {
        score += 10;
      }

      // Rating bonus (up to +10)
      if (profile.rating) {
        score += Math.min(10, Math.floor((profile.rating - 4) * 10));
      }

      // Featured bonus (+5)
      if (profile.is_featured) {
        score += 5;
      }

      // Experience/certification bonus (+5)
      if (profile.certifications && profile.certifications.length > 0) {
        score += 5;
      }

      // Cap score at 100
      score = Math.min(100, Math.max(0, score));

      return {
        id: profile.id,
        slug: profile.slug,
        title: profile.title,
        bio: profile.bio,
        specialties: profile.specialties || [],
        location: profile.location,
        primaryRegion: profile.primary_region,
        primaryCity: profile.primary_city,
        profileImageUrl: profile.profile_image_url,
        heroImageUrl: profile.hero_image_url,
        rating: profile.rating || 0,
        profileViews: profile.profile_views || 0,
        totalLeads: profile.total_leads || 0,
        certifications: profile.certifications || [],
        isFeatured: profile.is_featured || false,
        createdAt: profile.created_at,
        matchScore: score,
      };
    });

    // Sort by match score and take top 3
    const topMatches = scoredProfiles
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    return { success: true, data: topMatches };
  } catch (err) {
    const errorCode = logError(err, { action: 'getMatchedProfiles' });
    return { success: false, error: `Failed to match profiles [${errorCode}]` };
  }
}

export async function createQuickProfile(
  input: QuickProfileInput
): Promise<ActionResult<{ slug: string }>> {
  addActionBreadcrumb('createQuickProfile');

  try {
    // Validate inputs
    const validation = validateInput(
      quickProfileInputSchema,
      input,
      'createQuickProfile'
    );
    if (!validation.success) {
      return { success: false, error: validation.error };
    }
    const validInput = validation.data;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: AUTH_NOT_AUTHENTICATED };
    }

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        full_name: validInput.name,
        phone: validInput.phoneNumber,
        avatar_url: validInput.profileImageUrl || null,
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      logError(profileUpdateError, { action: 'createQuickProfile:profiles', userId: user.id });
      return { success: false, error: PROFILE_UPDATE_FAILED };
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
        title: validInput.name,
        birth_date: validInput.birthDate,
        verification_file_url: validInput.proVerificationFileUrl,
        primary_region: validInput.primaryRegion,
        primary_city: validInput.primaryCity,
        location: formatLocation(validInput.primaryRegion, validInput.primaryCity),
        profile_image_url: validInput.profileImageUrl || null,
      };

      updateData.kakao_talk_id = validInput.phoneNumber;

      const { error: updateError } = await supabase
        .from('pro_profiles')
        .update(updateData)
        .eq('id', existingProfile.id);

      if (updateError) {
        logError(updateError, { action: 'createQuickProfile:update', userId: user.id });
        return { success: false, error: PROFILE_UPDATE_FAILED };
      }

      revalidatePath('/dashboard');
      revalidatePath(`/profile/${existingProfile.slug}`);
      return { success: true, data: { slug: existingProfile.slug } };
    }

    // Generate unique slug from name
    const baseSlug = validInput.name
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
      title: validInput.name,
      bio: null,
      specialties: [],
      location: formatLocation(validInput.primaryRegion, validInput.primaryCity),
      certifications: [],
      birth_date: validInput.birthDate,
      verification_file_url: validInput.proVerificationFileUrl,
      primary_region: validInput.primaryRegion,
      primary_city: validInput.primaryCity,
      theme_type: 'curriculum' as const, // Default template
      theme_config: null,
      payment_link: null,
      open_chat_url: null,
      booking_url: null,
      hero_image_url: null,
      profile_image_url: validInput.profileImageUrl || null,
      gallery_images: [],
      video_url: null,
      instagram_username: null,
      youtube_channel_id: null,
      kakao_talk_id: validInput.phoneNumber,
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
          logError(retryError, { action: 'createQuickProfile:retry', userId: user.id });
          return { success: false, error: PROFILE_CREATE_FAILED };
        }

        revalidatePath('/dashboard');
        return { success: true, data: { slug: retryData.slug } };
      }

      logError(error, { action: 'createQuickProfile:insert', userId: user.id });
      return { success: false, error: PROFILE_CREATE_FAILED };
    }

    revalidatePath('/dashboard');
    return { success: true, data: { slug: data.slug } };
  } catch (err) {
    const errorCode = logError(err, { action: 'createQuickProfile' });
    return { success: false, error: errorCode };
  }
}
