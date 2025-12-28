/**
 * APM (Application Performance Monitoring) Module
 *
 * Comprehensive performance monitoring for TEE:UP.
 * Built on top of Sentry with additional utilities.
 *
 * ## Server-Side Usage
 *
 * ```typescript
 * // Wrap Server Actions
 * import { measureAction, measureQuery } from '@/lib/apm/server';
 *
 * export const updateProfile = measureAction('updateProfile', async (data) => {
 *   const result = await measureQuery('profiles.update', () =>
 *     supabase.from('pro_profiles').update(data)
 *   );
 *   return result;
 * });
 * ```
 *
 * ## Client-Side Usage
 *
 * ```tsx
 * // Initialize Web Vitals
 * import { initWebVitals, trackClick } from '@/lib/apm/client';
 *
 * useEffect(() => {
 *   initWebVitals();
 * }, []);
 *
 * // Track interactions
 * <button onClick={() => trackClick('submit_form')}>Submit</button>
 * ```
 *
 * ## Custom Metrics
 *
 * ```typescript
 * import { recordTiming, recordCount, measure } from '@/lib/apm';
 *
 * // Record timing
 * recordTiming('api.response', 150, 'api');
 *
 * // Record count
 * recordCount('leads.created', 1, 'custom');
 *
 * // Measure function
 * const result = measure('calculate', () => heavyCalculation());
 * ```
 */

// Types
export * from './types';

// Core metrics
export {
  createSpan,
  endSpan,
  getSpan,
  recordMetric,
  recordTiming,
  recordCount,
  measure,
  measureAsync,
  startTimer,
  setAPMTags,
  setAPMContext,
  setAPMUser,
} from './metrics';

// Server-side utilities (import separately for tree-shaking)
// import { measureAction, measureQuery, measureAPI } from '@/lib/apm/server';

// Client-side utilities (import separately for tree-shaking)
// import { initWebVitals, trackClick, reportError } from '@/lib/apm/client';
