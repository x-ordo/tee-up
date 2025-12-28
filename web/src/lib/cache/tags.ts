/**
 * Cache Tag Generators
 *
 * Tags enable granular cache invalidation via revalidateTag().
 * Each tag follows the pattern: `{entity}-{identifier}`
 *
 * Usage:
 *   Caching: unstable_cache(fn, [cacheKey], { tags: [profileTag(slug)] })
 *   Invalidation: revalidateTag(profileTag(slug))
 */

// ============================================
// PUBLIC CONTENT TAGS
// ============================================

/** Pro profile page: `profile-{slug}` */
export function profileTag(slug: string): string {
  return `profile-${slug}`;
}

/** Studio page: `studio-{slug}` */
export function studioTag(slug: string): string {
  return `studio-${slug}`;
}

/** Studio pros list: `studio-pros-{studioId}` */
export function studioProsTag(studioId: string): string {
  return `studio-pros-${studioId}`;
}

/** Site page: `site-{handle}` */
export function siteTag(handle: string): string {
  return `site-${handle}`;
}

/** Global tag for approved profiles list */
export const APPROVED_PROFILES_TAG = 'approved-profiles';

// ============================================
// USER-SPECIFIC TAGS
// ============================================

/** User profile: `user-profile-{userId}` */
export function userProfileTag(userId: string): string {
  return `user-profile-${userId}`;
}

/** Portfolio sections: `portfolio-sections-{profileId}` */
export function portfolioSectionsTag(profileId: string): string {
  return `portfolio-sections-${profileId}`;
}

/** User studios: `user-studios-{userId}` */
export function userStudiosTag(userId: string): string {
  return `user-studios-${userId}`;
}

/** Lead stats: `lead-stats-{userId}` */
export function leadStatsTag(userId: string): string {
  return `lead-stats-${userId}`;
}

// ============================================
// TAG COLLECTIONS
// ============================================

/**
 * All tags that should be invalidated when a profile is updated
 */
export function profileInvalidationTags(slug: string, userId?: string): string[] {
  const tags = [profileTag(slug), APPROVED_PROFILES_TAG];
  if (userId) {
    tags.push(userProfileTag(userId));
  }
  return tags;
}

/**
 * All tags that should be invalidated when a studio is updated
 */
export function studioInvalidationTags(slug: string, studioId: string): string[] {
  return [studioTag(slug), studioProsTag(studioId)];
}
