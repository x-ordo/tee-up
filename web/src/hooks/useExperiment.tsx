'use client';

/**
 * A/B Testing Hook
 * TEE:UP Portfolio SaaS
 *
 * Provides React hooks for experiment variant assignment
 * and conversion tracking in client components.
 */

import { useCallback, useEffect, useState, useRef, createContext, useContext, type ReactNode } from 'react';
import {
  getVariantAssignment,
  trackConversion,
  type ExperimentAssignment,
} from '@/actions/experiments';
import { trackEvent } from '@/lib/analytics';

// ============================================================
// Session ID Management
// ============================================================

function getExperimentSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session';

  const stored = sessionStorage.getItem('teeup_experiment_session');
  if (stored) return stored;

  const sessionId = `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem('teeup_experiment_session', sessionId);
  return sessionId;
}

// ============================================================
// Types
// ============================================================

interface UseExperimentOptions {
  /**
   * Experiment name (must match database)
   */
  experimentName: string;

  /**
   * User ID (if authenticated)
   */
  userId?: string;

  /**
   * Whether to track assignment in analytics
   */
  trackAssignment?: boolean;
}

interface UseExperimentResult {
  /**
   * Current variant name (null if not assigned)
   */
  variant: string | null;

  /**
   * Variant configuration object
   */
  config: Record<string, unknown>;

  /**
   * Whether the assignment is being loaded
   */
  isLoading: boolean;

  /**
   * Whether this is a new assignment
   */
  isNewAssignment: boolean;

  /**
   * Track a conversion event
   */
  trackConversion: (metricName: string, value?: number, metadata?: Record<string, unknown>) => void;

  /**
   * Check if variant matches a specific name
   */
  isVariant: (variantName: string) => boolean;
}

// ============================================================
// Main Hook
// ============================================================

/**
 * Hook for A/B testing variant assignment and conversion tracking
 *
 * @example
 * ```tsx
 * function SignupButton() {
 *   const { variant, config, trackConversion } = useExperiment({
 *     experimentName: 'signup_button_color',
 *   });
 *
 *   const handleClick = () => {
 *     trackConversion('button_click');
 *     // ... signup logic
 *   };
 *
 *   return (
 *     <button
 *       style={{ backgroundColor: config.color as string }}
 *       onClick={handleClick}
 *     >
 *       {variant === 'variant_a' ? '무료로 시작하기' : '지금 가입하기'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useExperiment(options: UseExperimentOptions): UseExperimentResult {
  const { experimentName, userId, trackAssignment = true } = options;

  const [variant, setVariant] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNewAssignment, setIsNewAssignment] = useState(false);

  const sessionIdRef = useRef<string>('');
  const assignmentRef = useRef<ExperimentAssignment | null>(null);

  // Initialize session ID
  useEffect(() => {
    sessionIdRef.current = getExperimentSessionId();
  }, []);

  // Get variant assignment
  useEffect(() => {
    async function getAssignment() {
      if (!sessionIdRef.current && !userId) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getVariantAssignment({
          experimentName,
          userId,
          sessionId: sessionIdRef.current,
        });

        if (result.success && result.data) {
          setVariant(result.data.variant_name);
          setConfig(result.data.variant_config);
          setIsNewAssignment(result.data.is_new_assignment);
          assignmentRef.current = result.data;

          // Track assignment in analytics
          if (trackAssignment && result.data.is_new_assignment) {
            trackEvent('experiment_assigned', 'user_action', {
              experiment_name: experimentName,
              variant_name: result.data.variant_name,
              variant_id: result.data.variant_id,
            });
          }
        }
      } catch (error) {
        console.error('[Experiment] Failed to get variant:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getAssignment();
  }, [experimentName, userId, trackAssignment]);

  // Track conversion
  const handleTrackConversion = useCallback(
    async (metricName: string, value?: number, metadata?: Record<string, unknown>) => {
      if (!assignmentRef.current) return;

      try {
        await trackConversion({
          experimentName,
          metricName,
          userId,
          sessionId: sessionIdRef.current,
          value,
          metadata,
        });

        // Also track in analytics
        trackEvent('experiment_conversion', 'conversion', {
          experiment_name: experimentName,
          variant_name: assignmentRef.current.variant_name,
          metric_name: metricName,
          value,
          ...metadata,
        });
      } catch (error) {
        console.error('[Experiment] Failed to track conversion:', error);
      }
    },
    [experimentName, userId]
  );

  // Check variant helper
  const isVariant = useCallback(
    (variantName: string) => {
      return variant === variantName;
    },
    [variant]
  );

  return {
    variant,
    config,
    isLoading,
    isNewAssignment,
    trackConversion: handleTrackConversion,
    isVariant,
  };
}

// ============================================================
// Feature Flag Hook
// ============================================================

interface UseFeatureFlagOptions {
  /**
   * Feature flag name (experiment name)
   */
  flagName: string;

  /**
   * User ID (if authenticated)
   */
  userId?: string;

  /**
   * Default value if not in experiment
   */
  defaultValue?: boolean;
}

/**
 * Simplified hook for feature flags (boolean experiments)
 *
 * @example
 * ```tsx
 * function NewFeature() {
 *   const { isEnabled, isLoading } = useFeatureFlag({
 *     flagName: 'new_dashboard',
 *     defaultValue: false,
 *   });
 *
 *   if (isLoading) return null;
 *
 *   return isEnabled ? <NewDashboard /> : <OldDashboard />;
 * }
 * ```
 */
export function useFeatureFlag(options: UseFeatureFlagOptions) {
  const { flagName, userId, defaultValue = false } = options;

  const { variant, isLoading } = useExperiment({
    experimentName: flagName,
    userId,
    trackAssignment: true,
  });

  // 'enabled' variant means feature is on
  const isEnabled = variant === 'enabled' || variant === 'variant_a';

  return {
    isEnabled: isLoading ? defaultValue : isEnabled,
    isLoading,
    variant,
  };
}

// ============================================================
// Multiple Experiments Hook
// ============================================================

/**
 * Hook for managing multiple experiments at once
 *
 * @example
 * ```tsx
 * function App() {
 *   const experiments = useExperiments([
 *     'signup_flow',
 *     'pricing_display',
 *     'cta_text',
 *   ]);
 *
 *   return (
 *     <ExperimentProvider value={experiments}>
 *       <Layout />
 *     </ExperimentProvider>
 *   );
 * }
 * ```
 */
export function useExperiments(
  experimentNames: string[],
  userId?: string
): Record<string, UseExperimentResult> {
  const [results, setResults] = useState<Record<string, UseExperimentResult>>({});

  useEffect(() => {
    const newResults: Record<string, UseExperimentResult> = {};

    experimentNames.forEach((name) => {
      // Each experiment will be handled individually
      newResults[name] = {
        variant: null,
        config: {},
        isLoading: true,
        isNewAssignment: false,
        trackConversion: () => {},
        isVariant: () => false,
      };
    });

    setResults(newResults);
  }, [experimentNames.join(',')]);

  // Note: In a real implementation, you'd want to batch these requests
  // For now, each useExperiment should be called separately

  return results;
}

// ============================================================
// Experiment Context (for SSR)
// ============================================================

interface ExperimentContextValue {
  assignments: Record<string, ExperimentAssignment>;
}

const ExperimentContext = createContext<ExperimentContextValue>({
  assignments: {},
});

interface ExperimentProviderProps {
  children: ReactNode;
  initialAssignments?: Record<string, ExperimentAssignment>;
}

/**
 * Provider for experiment assignments (useful for SSR)
 */
export function ExperimentProvider({ children, initialAssignments = {} }: ExperimentProviderProps) {
  return (
    <ExperimentContext.Provider value={{ assignments: initialAssignments }}>
      {children}
    </ExperimentContext.Provider>
  );
}

/**
 * Access experiment assignments from context
 */
export function useExperimentContext() {
  return useContext(ExperimentContext);
}
