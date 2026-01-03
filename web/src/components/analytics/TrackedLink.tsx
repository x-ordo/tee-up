'use client';

/**
 * TrackedLink Component
 * TEE:UP Portfolio SaaS
 *
 * A Next.js Link wrapper that tracks click events via analytics.
 */

import Link from 'next/link';
import { useCallback, type ComponentPropsWithoutRef } from 'react';
import { engagement, consumer, pro } from '@/lib/analytics';

// ============================================================
// Types
// ============================================================

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

interface TrackedLinkProps extends LinkProps {
  /**
   * Unique identifier for the link (used in analytics)
   */
  trackId: string;

  /**
   * Optional visible text to track (defaults to children if text)
   */
  trackLabel?: string;

  /**
   * Type of CTA for funnel tracking
   */
  ctaType?: 'hero' | 'quiz' | 'explore' | 'consultation' | 'signup' | 'pro_signup';
}

// ============================================================
// Component
// ============================================================

export function TrackedLink({
  trackId,
  trackLabel,
  ctaType,
  onClick,
  children,
  href,
  ...props
}: TrackedLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Track the click
      engagement.click(
        trackId,
        trackLabel || (typeof children === 'string' ? children : undefined),
        typeof href === 'string' ? href : (href.pathname ?? undefined)
      );

      // Track CTA specific events
      if (ctaType) {
        switch (ctaType) {
          case 'hero':
          case 'quiz':
          case 'explore':
          case 'consultation':
            consumer.clickCTA(ctaType);
            break;
          case 'signup':
          case 'pro_signup':
            pro.clickSignup(ctaType);
            break;
        }
      }

      // Call original onClick if provided
      onClick?.(e);
    },
    [trackId, trackLabel, ctaType, children, href, onClick]
  );

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

TrackedLink.displayName = 'TrackedLink';
