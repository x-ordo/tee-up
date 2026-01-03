'use client';

/**
 * PageViewTracker Component
 * TEE:UP Portfolio SaaS
 *
 * Tracks specific page view events when mounted.
 */

import { useEffect } from 'react';
import { consumer, pro } from '@/lib/analytics';

// ============================================================
// Types
// ============================================================

interface PageViewTrackerProps {
  /**
   * Type of page to track
   */
  pageType: 'consumer_landing' | 'pro_landing' | 'pro_profile' | 'quiz' | 'explore';

  /**
   * Additional data for tracking (e.g., proId for pro profile pages)
   */
  data?: {
    proId?: string;
    proSlug?: string;
    proName?: string;
  };
}

// ============================================================
// Component
// ============================================================

export function PageViewTracker({ pageType, data }: PageViewTrackerProps) {
  useEffect(() => {
    switch (pageType) {
      case 'consumer_landing':
        consumer.viewLanding();
        break;
      case 'pro_landing':
        pro.viewLanding();
        break;
      case 'pro_profile':
        if (data?.proId && data?.proSlug) {
          consumer.viewPro(data.proId, data.proSlug, data.proName);
        }
        break;
      case 'quiz':
        consumer.startQuiz();
        break;
      case 'explore':
        // Explorer doesn't have a dedicated tracking event, page view is sufficient
        break;
    }
  }, [pageType, data]);

  // This component doesn't render anything
  return null;
}

PageViewTracker.displayName = 'PageViewTracker';
