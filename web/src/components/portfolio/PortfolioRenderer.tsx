'use client';

import { VisualTemplate, CurriculumTemplate, SocialTemplate } from './templates';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeType } from '@/actions/types';
import type { ThemeConfig } from '@/actions/theme';
import { generateAccentVariants } from '@/lib/color-utils';

interface PortfolioRendererProps {
  profile: ProProfile & {
    highlights?: { label: string; value: string; detail?: string }[];
    testimonials?: { name: string; quote: string; avatar?: string; rating?: number }[];
    curriculum?: { title: string; description: string; duration?: string }[];
    priceTiers?: { name: string; price: string; duration: string; features?: string[]; popular?: boolean }[];
    faq?: { question: string; answer: string }[];
    instagramPosts?: { id: string; image: string; url: string }[];
    youtubeVideos?: { id: string; title: string }[];
    achievements?: { title: string; tourOrEvent?: string; year?: string; placement?: string; note?: string }[];
    sponsorships?: { brand: string; role?: string; period?: string; link?: string; logoUrl?: string }[];
    mediaHighlights?: { outlet?: string; headline: string; date?: string; link?: string; mediaType?: string; thumbnailUrl?: string }[];
    availability?: { region?: string; cadence?: string; preferredDays?: string; timeWindow?: string; seasonality?: string }[];
  };
  themeConfig?: ThemeConfig;
  sections?: { sectionType: string; title?: string | null; subtitle?: string | null }[];
}

const FONT_PRESET_CLASSES = {
  default: 'font-pretendard',
  modern: 'font-pretendard',
  classic: 'font-serif',
} as const;

/**
 * Renders the appropriate portfolio template based on theme_type
 * Applies custom theme configuration including accent color and font preset
 */
export function PortfolioRenderer({ profile, themeConfig, sections }: PortfolioRendererProps) {
  const themeType = profile.theme_type as ThemeType;
  const fontClass = themeConfig?.fontPreset
    ? FONT_PRESET_CLASSES[themeConfig.fontPreset]
    : FONT_PRESET_CLASSES.default;
  const accentVariants = themeConfig?.accentColor
    ? generateAccentVariants(themeConfig.accentColor)
    : null;

  const templateProps = { profile, themeConfig, sections };

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
        accentVariants
          ? ({
              '--portfolio-accent': accentVariants.base,
              '--tee-accent-primary': accentVariants.base,
              '--tee-accent-primary-hover': accentVariants.hover,
              '--tee-accent-primary-active': accentVariants.active,
              '--tee-accent-primary-disabled': accentVariants.disabled,
            } as React.CSSProperties)
          : undefined
      }
    >
      {content}
    </div>
  );
}
