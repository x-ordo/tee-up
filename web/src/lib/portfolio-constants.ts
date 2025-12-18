import type { ThemeType } from '@/actions/types';

/**
 * Default sections by theme type
 */
export const DEFAULT_SECTIONS: Record<ThemeType, { section_type: string; title: string }[]> = {
  visual: [
    { section_type: 'hero', title: 'Hero' },
    { section_type: 'gallery', title: 'Gallery' },
    { section_type: 'stats', title: 'Statistics' },
    { section_type: 'testimonials', title: 'Testimonials' },
    { section_type: 'contact', title: 'Contact' },
  ],
  curriculum: [
    { section_type: 'hero', title: 'Hero' },
    { section_type: 'curriculum', title: 'Curriculum' },
    { section_type: 'pricing', title: 'Pricing' },
    { section_type: 'faq', title: 'FAQ' },
    { section_type: 'contact', title: 'Contact' },
  ],
  social: [
    { section_type: 'hero', title: 'Hero' },
    { section_type: 'instagram_feed', title: 'Instagram Feed' },
    { section_type: 'youtube_embed', title: 'YouTube Videos' },
    { section_type: 'testimonials', title: 'Testimonials' },
    { section_type: 'contact', title: 'Contact' },
  ],
};
