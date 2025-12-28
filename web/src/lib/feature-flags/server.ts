/**
 * Server-Side Feature Flag Utilities
 *
 * For use in Server Components, Server Actions, and API routes.
 *
 * Usage:
 * ```tsx
 * // Server Component
 * import { getServerFlag, isServerFlagEnabled } from '@/lib/feature-flags/server';
 *
 * export default async function Page() {
 *   const user = await getCurrentUser();
 *   const isNewEditorEnabled = await isServerFlagEnabled('PORTFOLIO_NEW_EDITOR', {
 *     userId: user?.id,
 *   });
 *
 *   return isNewEditorEnabled ? <NewEditor /> : <LegacyEditor />;
 * }
 * ```
 */

import { createClient } from '@/lib/supabase/server';
import { evaluateFlag, isEnabled, getAllFlags, createServerContext } from './provider';
import { FLAGS, type FlagKey } from './flags';
import type { FlagContext, FlagValue } from './types';

// ============================================
// SERVER-SIDE CONTEXT
// ============================================

/**
 * Get flag context from the current request
 * Automatically extracts user info from Supabase session
 */
export async function getRequestContext(): Promise<FlagContext> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Optionally fetch user tier from database
      const { data: profile } = await supabase
        .from('pro_profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single();

      return createServerContext({
        userId: user.id,
        userTier: profile?.subscription_tier as FlagContext['userTier'],
      });
    }

    return createServerContext({});
  } catch {
    return createServerContext({});
  }
}

// ============================================
// SERVER-SIDE FLAG EVALUATION
// ============================================

/**
 * Check if a flag is enabled (server-side)
 *
 * @param flagKey - The flag key to check
 * @param context - Optional context (auto-detected if not provided)
 */
export async function isServerFlagEnabled(
  flagKey: FlagKey,
  context?: FlagContext
): Promise<boolean> {
  const effectiveContext = context ?? await getRequestContext();
  return isEnabled(flagKey, effectiveContext);
}

/**
 * Get a flag value (server-side)
 *
 * @param flagKey - The flag key to get
 * @param context - Optional context (auto-detected if not provided)
 */
export async function getServerFlag<K extends FlagKey>(
  flagKey: K,
  context?: FlagContext
): Promise<(typeof FLAGS)[K]['defaultValue']> {
  const effectiveContext = context ?? await getRequestContext();
  return evaluateFlag(flagKey, effectiveContext).value;
}

/**
 * Get all flags for the current request (server-side)
 *
 * @param context - Optional context (auto-detected if not provided)
 */
export async function getServerFlags(
  context?: FlagContext
): Promise<Record<FlagKey, FlagValue>> {
  const effectiveContext = context ?? await getRequestContext();
  return getAllFlags(effectiveContext);
}

// ============================================
// FLAG INJECTION FOR CLIENT
// ============================================

/**
 * Serialize flags for client hydration
 *
 * Use this in layouts to pass pre-evaluated flags to client components:
 *
 * ```tsx
 * // app/layout.tsx
 * export default async function RootLayout({ children }) {
 *   const flagData = await getClientFlagData();
 *
 *   return (
 *     <html>
 *       <body>
 *         <FlagProvider initialFlags={flagData}>
 *           {children}
 *         </FlagProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export async function getClientFlagData(): Promise<{
  flags: Record<FlagKey, FlagValue>;
  context: FlagContext;
}> {
  const context = await getRequestContext();
  const flags = getAllFlags(context);

  return {
    flags,
    context: {
      // Only include safe context data for client
      userId: context.userId,
      userTier: context.userTier,
      environment: context.environment,
    },
  };
}
