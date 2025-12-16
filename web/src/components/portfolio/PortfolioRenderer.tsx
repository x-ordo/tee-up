'use client';

import { VisualTemplate, CurriculumTemplate, SocialTemplate } from './templates';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeType } from '@/actions/types';

interface PortfolioRendererProps {
  profile: ProProfile & {
    highlights?: { label: string; value: string; detail?: string }[];
    testimonials?: { name: string; quote: string; avatar?: string; rating?: number }[];
    curriculum?: { title: string; description: string; duration?: string }[];
    priceTiers?: { name: string; price: string; duration: string; features?: string[]; popular?: boolean }[];
    faq?: { question: string; answer: string }[];
    instagramPosts?: { id: string; image: string; url: string }[];
    youtubeVideos?: { id: string; title: string }[];
  };
}

/**
 * Renders the appropriate portfolio template based on theme_type
 */
export function PortfolioRenderer({ profile }: PortfolioRendererProps) {
  const themeType = profile.theme_type as ThemeType;

  switch (themeType) {
    case 'curriculum':
      return <CurriculumTemplate profile={profile} />;
    case 'social':
      return <SocialTemplate profile={profile} />;
    case 'visual':
    default:
      return <VisualTemplate profile={profile} />;
  }
}
