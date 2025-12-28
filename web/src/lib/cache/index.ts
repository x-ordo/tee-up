/**
 * Cache Utilities
 *
 * Provides caching layer for Server Actions using Next.js unstable_cache.
 *
 * Key Features:
 * - TTL-based expiration (constants.ts)
 * - Tag-based invalidation (tags.ts)
 * - Type-safe wrappers for common patterns
 */

export * from './constants';
export * from './tags';

import { unstable_cache } from 'next/cache';
import { CACHE_TTL } from './constants';
import {
  profileTag,
  studioTag,
  studioProsTag,
  siteTag,
  APPROVED_PROFILES_TAG,
  userProfileTag,
  portfolioSectionsTag,
} from './tags';

// ============================================
// CACHED DATA FETCHERS
// ============================================

/**
 * Create a cached version of getPublicProfile
 *
 * Usage:
 *   const profile = await cachedPublicProfile(slug, fetchFn);
 *
 * @param slug - Profile slug
 * @param fetcher - Function that fetches the profile from DB
 */
export function createCachedPublicProfile<T>(
  slug: string,
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, [`public-profile-${slug}`], {
    revalidate: CACHE_TTL.PUBLIC_PROFILE,
    tags: [profileTag(slug)],
  });
}

/**
 * Create a cached version of getPublicStudio
 */
export function createCachedPublicStudio<T>(
  slug: string,
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, [`public-studio-${slug}`], {
    revalidate: CACHE_TTL.PUBLIC_STUDIO,
    tags: [studioTag(slug)],
  });
}

/**
 * Create a cached version of getStudioPros
 */
export function createCachedStudioPros<T>(
  studioId: string,
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, [`studio-pros-${studioId}`], {
    revalidate: CACHE_TTL.PUBLIC_STUDIO,
    tags: [studioProsTag(studioId)],
  });
}

/**
 * Create a cached version of getApprovedProfiles
 */
export function createCachedApprovedProfiles<T>(
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, ['approved-profiles'], {
    revalidate: CACHE_TTL.APPROVED_PROFILES,
    tags: [APPROVED_PROFILES_TAG],
  });
}

/**
 * Create a cached version of getPublicSite
 */
export function createCachedPublicSite<T>(
  handle: string,
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, [`public-site-${handle}`], {
    revalidate: CACHE_TTL.PUBLIC_SITE,
    tags: [siteTag(handle)],
  });
}

// ============================================
// USER-SPECIFIC CACHED FETCHERS
// ============================================

/**
 * Create a cached version of getCurrentUserProfile
 *
 * Note: User-specific caches use userId as part of the cache key
 */
export function createCachedUserProfile<T>(
  userId: string,
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, [`user-profile-${userId}`], {
    revalidate: CACHE_TTL.USER_PROFILE,
    tags: [userProfileTag(userId)],
  });
}

/**
 * Create a cached version of getPortfolioSections
 */
export function createCachedPortfolioSections<T>(
  profileId: string,
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, [`portfolio-sections-${profileId}`], {
    revalidate: CACHE_TTL.PORTFOLIO_SECTIONS,
    tags: [portfolioSectionsTag(profileId)],
  });
}
