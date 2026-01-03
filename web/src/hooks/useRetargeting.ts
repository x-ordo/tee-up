'use client';

/**
 * Retargeting Hook
 * TEE:UP Portfolio SaaS
 *
 * Provides easy-to-use functions for tracking user activity
 * and managing retargeting events in components.
 */

import { useCallback, useEffect, useRef } from 'react';
import { trackActivityEvent, markEventCompleted, type ActivityEventType } from '@/actions/retargeting';

// ============================================================
// Session ID Management
// ============================================================

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session';

  const stored = sessionStorage.getItem('teeup_retarget_session');
  if (stored) return stored;

  const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem('teeup_retarget_session', sessionId);
  return sessionId;
}

// ============================================================
// Hook
// ============================================================

interface UseRetargetingOptions {
  proId?: string;
  pageUrl?: string;
}

export function useRetargeting(options: UseRetargetingOptions = {}) {
  const sessionIdRef = useRef<string>('');
  const trackedEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  /**
   * Track a user activity event
   */
  const trackEvent = useCallback(
    async (
      eventType: ActivityEventType,
      metadata?: Record<string, unknown>,
      contactInfo?: { email?: string; phone?: string }
    ) => {
      // Prevent duplicate tracking in same session
      const eventKey = `${eventType}-${options.proId || 'none'}`;
      if (trackedEventsRef.current.has(eventKey)) {
        return;
      }
      trackedEventsRef.current.add(eventKey);

      try {
        await trackActivityEvent({
          eventType,
          sessionId: sessionIdRef.current,
          proId: options.proId,
          pageUrl: options.pageUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
          referrer: typeof window !== 'undefined' ? document.referrer : undefined,
          metadata,
          email: contactInfo?.email,
          phone: contactInfo?.phone,
        });
      } catch (error) {
        console.error('[Retargeting] Failed to track event:', error);
      }
    },
    [options.proId, options.pageUrl]
  );

  /**
   * Mark an event as completed (prevents retargeting)
   */
  const completeEvent = useCallback(async (eventType: ActivityEventType) => {
    try {
      await markEventCompleted({
        sessionId: sessionIdRef.current,
        eventType,
      });
    } catch (error) {
      console.error('[Retargeting] Failed to mark event completed:', error);
    }
  }, []);

  // ============================================================
  // Convenience Methods
  // ============================================================

  /**
   * Track quiz start
   */
  const trackQuizStart = useCallback(
    (step?: number) => {
      trackEvent('quiz_start', { initial_step: step });
    },
    [trackEvent]
  );

  /**
   * Track quiz abandonment (call on unmount or navigation)
   */
  const trackQuizAbandon = useCallback(
    (currentStep: number, totalSteps: number, answers?: Record<string, unknown>) => {
      trackEvent('quiz_abandon', {
        current_step: currentStep,
        total_steps: totalSteps,
        progress: Math.round((currentStep / totalSteps) * 100),
        answers,
      });
    },
    [trackEvent]
  );

  /**
   * Track quiz completion
   */
  const trackQuizComplete = useCallback(
    (matchedPros?: number) => {
      trackEvent('quiz_complete', { matched_pros: matchedPros });
      completeEvent('quiz_complete');
    },
    [trackEvent, completeEvent]
  );

  /**
   * Track form interaction start
   */
  const trackFormStart = useCallback(
    (formName: string) => {
      trackEvent('form_start', { form_name: formName });
    },
    [trackEvent]
  );

  /**
   * Track form abandonment
   */
  const trackFormAbandon = useCallback(
    (formName: string, filledFields?: string[]) => {
      trackEvent('form_abandon', {
        form_name: formName,
        filled_fields: filledFields,
        progress: filledFields ? filledFields.length : 0,
      });
    },
    [trackEvent]
  );

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback(
    (formName: string, contactInfo?: { email?: string; phone?: string }) => {
      trackEvent('form_submit', { form_name: formName }, contactInfo);
      completeEvent('form_submit');
    },
    [trackEvent, completeEvent]
  );

  /**
   * Track profile view
   */
  const trackProfileView = useCallback(
    (proId: string, proName?: string) => {
      trackEvent('profile_view', { pro_id: proId, pro_name: proName });
    },
    [trackEvent]
  );

  /**
   * Track signup start
   */
  const trackSignupStart = useCallback(
    (source?: string) => {
      trackEvent('signup_start', { source });
    },
    [trackEvent]
  );

  /**
   * Track signup abandonment
   */
  const trackSignupAbandon = useCallback(
    (step?: string, email?: string) => {
      trackEvent('signup_abandon', { step }, { email });
    },
    [trackEvent]
  );

  /**
   * Track signup completion
   */
  const trackSignupComplete = useCallback(() => {
    trackEvent('signup_complete');
    completeEvent('signup_complete');
  }, [trackEvent, completeEvent]);

  /**
   * Track consultation form start
   */
  const trackConsultationStart = useCallback(
    (proId: string) => {
      trackEvent('consultation_start', { pro_id: proId });
    },
    [trackEvent]
  );

  /**
   * Track consultation form abandonment
   */
  const trackConsultationAbandon = useCallback(
    (proId: string, filledFields?: string[]) => {
      trackEvent('consultation_abandon', {
        pro_id: proId,
        filled_fields: filledFields,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    completeEvent,
    // Quiz
    trackQuizStart,
    trackQuizAbandon,
    trackQuizComplete,
    // Forms
    trackFormStart,
    trackFormAbandon,
    trackFormSubmit,
    // Profile
    trackProfileView,
    // Signup
    trackSignupStart,
    trackSignupAbandon,
    trackSignupComplete,
    // Consultation
    trackConsultationStart,
    trackConsultationAbandon,
  };
}

// ============================================================
// Form Abandonment Detector Hook
// ============================================================

interface UseFormAbandonmentOptions {
  formName: string;
  proId?: string;
  onAbandon?: (filledFields: string[]) => void;
}

/**
 * Hook to automatically detect form abandonment
 * Tracks when user leaves a form without submitting
 */
export function useFormAbandonment(options: UseFormAbandonmentOptions) {
  const { formName, proId, onAbandon } = options;
  const filledFieldsRef = useRef<Set<string>>(new Set());
  const isSubmittedRef = useRef(false);
  const { trackFormStart, trackFormAbandon, trackFormSubmit } = useRetargeting({ proId });

  // Track form start on mount
  useEffect(() => {
    trackFormStart(formName);

    // Track abandonment on unmount (if not submitted)
    return () => {
      if (!isSubmittedRef.current && filledFieldsRef.current.size > 0) {
        const filledFields = Array.from(filledFieldsRef.current);
        trackFormAbandon(formName, filledFields);
        onAbandon?.(filledFields);
      }
    };
  }, [formName, trackFormStart, trackFormAbandon, onAbandon]);

  // Track field changes
  const onFieldChange = useCallback((fieldName: string, hasValue: boolean) => {
    if (hasValue) {
      filledFieldsRef.current.add(fieldName);
    } else {
      filledFieldsRef.current.delete(fieldName);
    }
  }, []);

  // Mark as submitted
  const onSubmit = useCallback(
    (contactInfo?: { email?: string; phone?: string }) => {
      isSubmittedRef.current = true;
      trackFormSubmit(formName, contactInfo);
    },
    [formName, trackFormSubmit]
  );

  return {
    onFieldChange,
    onSubmit,
  };
}
