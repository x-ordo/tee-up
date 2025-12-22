'use client';

import { VisualTemplate, CurriculumTemplate, SocialTemplate } from './templates';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeType } from '@/actions/types';
import type { ThemeConfig } from '@/actions/theme';

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
  themeConfig?: ThemeConfig;
}

const FONT_PRESET_CLASSES = {
  default: 'font-pretendard',
  modern: 'font-inter',
  classic: 'font-serif',
} as const;

/**
 * Renders the appropriate portfolio template based on theme_type
 * Applies custom theme configuration including accent color and font preset
 */
export function PortfolioRenderer({ profile, themeConfig }: PortfolioRendererProps) {
  const themeType = profile.theme_type as ThemeType;
  const fontClass = themeConfig?.fontPreset
    ? FONT_PRESET_CLASSES[themeConfig.fontPreset]
    : FONT_PRESET_CLASSES.default;

  const templateProps = { profile, themeConfig };

  const content = (() => {
    switch (themeType) {
      case 'curriculum':
        return <CurriculumTemplate {...templateProps} />;
      case 'social':
        return <SocialTemplate {...templateProps} />;
      case 'visual':
      default:
        return <VisualTemplate {...templateProps} />;
    }
  })();

  return (
    <div
      className={fontClass}
      style={
        themeConfig?.accentColor
          ? ({ '--portfolio-accent': themeConfig.accentColor } as React.CSSProperties)
          : undefined
      }
    >
      {content}
    </div>
  );
}
