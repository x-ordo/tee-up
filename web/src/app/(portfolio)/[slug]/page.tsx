import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPublicProfile, incrementProfileViews } from '@/actions/profiles';
import { getDefaultTheme, type ThemeConfig } from '@/lib/theme-config';
import { PortfolioRenderer, PortfolioHeader } from '@/components/portfolio';
import { createPublicClient } from '@/lib/supabase/server';

type PortfolioSection = {
  section_type: string;
  title: string | null;
  content: Record<string, unknown> | null;
};

type RawSectionItem = Record<string, unknown>;

interface PortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicProfile(slug);

  if (!result.success || !result.data) {
    return {
      title: 'Profile Not Found',
    };
  }

  const profile = result.data;

  return {
    title: `${profile.title} | Golf Pro`,
    description: profile.bio || `${profile.title} - Professional Golf Instructor`,
    openGraph: {
      title: profile.title,
      description: profile.bio || undefined,
      images: profile.hero_image_url ? [profile.hero_image_url] : undefined,
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const result = await getPublicProfile(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  // Track profile view (fire and forget)
  incrementProfileViews(slug).catch(() => {
    // Silently ignore errors
  });

  const profile = result.data;
  const themeConfig: ThemeConfig = profile.theme_config || getDefaultTheme();
  const supabase = createPublicClient();
  const { data: sections } = await supabase
    .from('portfolio_sections')
    .select('section_type, title, content')
    .eq('pro_profile_id', profile.id)
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  const readString = (value: unknown): string | undefined => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }
    if (typeof value === 'number') return `${value}`;
    return undefined;
  };

  const sectionMap = new Map<string, Record<string, unknown>>();
  sections?.forEach((section: PortfolioSection) => {
    sectionMap.set(section.section_type, section.content ?? {});
  });
  const orderedSections = sections?.map((section) => {
    const content = section.content ?? {};
    const sectionTitle = readString(section.title) || readString(content.title) || null;
    const sectionSubtitle = readString(content.subtitle) || null;
    return {
      sectionType: section.section_type,
      title: sectionTitle,
      subtitle: sectionSubtitle,
    };
  });

  const parseItemsArray = (
    content: Record<string, unknown> | undefined,
    key: string,
    fallbackKey?: string
  ): RawSectionItem[] => {
    const raw = content?.[key] ?? (fallbackKey ? content?.[fallbackKey] : undefined);
    if (Array.isArray(raw)) {
      return raw.filter((item): item is RawSectionItem => typeof item === 'object' && item !== null);
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is RawSectionItem => typeof item === 'object' && item !== null);
        }
      } catch {
        return [];
      }
    }
    return [];
  };

  const parseStringArray = (
    content: Record<string, unknown> | undefined,
    key: string,
    fallbackKey?: string
  ): string[] => {
    const raw = content?.[key] ?? (fallbackKey ? content?.[fallbackKey] : undefined);
    if (Array.isArray(raw)) {
      return raw
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0);
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => (typeof item === 'string' ? item.trim() : ''))
            .filter((item) => item.length > 0);
        }
      } catch {
        return raw
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
    }
    return [];
  };

  const parseBoolean = (value: unknown): boolean | undefined => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return undefined;
  };

  const parseNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  };

  const parseFeatureList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0);
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => (typeof item === 'string' ? item.trim() : ''))
            .filter((item) => item.length > 0);
        }
      } catch {
        return value
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
    }
    return [];
  };

  const extractYoutubeId = (value: string): string | undefined => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return undefined;
    try {
      const url = new URL(trimmed);
      if (url.hostname === 'youtu.be') {
        return url.pathname.replace('/', '') || undefined;
      }
      if (url.hostname.includes('youtube.com')) {
        const id = url.searchParams.get('v');
        if (id) return id;
        const parts = url.pathname.split('/');
        const embedIndex = parts.findIndex((part) => part === 'embed');
        if (embedIndex >= 0 && parts[embedIndex + 1]) {
          return parts[embedIndex + 1];
        }
      }
    } catch {
      return undefined;
    }
    return undefined;
  };

  const parseYoutubeVideos = (content: Record<string, unknown> | undefined) => {
    const raw = content?.videos ?? content?.items;
    if (Array.isArray(raw)) {
      return raw
        .map((item, index) => {
          if (typeof item === 'string') {
            const id = extractYoutubeId(item);
            return id ? { id, title: `YouTube Video ${index + 1}` } : null;
          }
          if (typeof item === 'object' && item !== null) {
            const url = readString(item.url) || readString(item.link);
            const id = readString(item.id) || (url ? extractYoutubeId(url) : undefined);
            if (!id) return null;
            return {
              id,
              title: readString(item.title) || `YouTube Video ${index + 1}`,
            };
          }
          return null;
        })
        .filter((item): item is { id: string; title: string } => item !== null);
    }
    if (typeof raw === 'string') {
      const lines = raw
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      return lines
        .map((line, index) => {
          const id = extractYoutubeId(line);
          return id ? { id, title: `YouTube Video ${index + 1}` } : null;
        })
        .filter((item): item is { id: string; title: string } => item !== null);
    }
    return [];
  };

  const parseInstagramPosts = (
    content: Record<string, unknown> | undefined,
    fallbackImages: string[],
    username?: string | null
  ) => {
    const raw = content?.posts ?? content?.images;
    const images: string[] = [];
    if (Array.isArray(raw)) {
      raw.forEach((item) => {
        if (typeof item === 'string') {
          const trimmed = item.trim();
          if (trimmed.length > 0) images.push(trimmed);
        } else if (typeof item === 'object' && item !== null) {
          const image = readString(item.image) || readString(item.url);
          if (image) images.push(image);
        }
      });
    } else if (typeof raw === 'string') {
      images.push(
        ...raw
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      );
    }

    const resolvedImages = images.length > 0 ? images : fallbackImages;
    const postCount = parseNumber(content?.post_count);
    const maxCount =
      typeof postCount === 'number' && postCount > 0
        ? Math.min(postCount, resolvedImages.length)
        : resolvedImages.length;
    const postUrl = username ? `https://instagram.com/${username}` : undefined;

    return resolvedImages.slice(0, maxCount).map((image, index) => ({
      id: `ig-${index}`,
      image,
      url: postUrl || image,
    }));
  };

  const testimonials = parseItemsArray(sectionMap.get('testimonials'), 'testimonials', 'items')
    .map((item) => {
      const quote = readString(item.quote) || readString(item.content) || '';
      return {
        name: readString(item.name) || '수강생',
        quote,
        rating: typeof item.rating === 'number'
          ? item.rating
          : typeof item.rating === 'string' && !Number.isNaN(Number(item.rating))
            ? Number(item.rating)
            : undefined,
      };
    })
    .filter((item) => item.quote.length > 0);

  const achievements = parseItemsArray(sectionMap.get('achievements'), 'items')
    .map((item) => ({
      title: readString(item.title) || readString(item.tour_or_event) || readString(item.event) || '',
      tourOrEvent: readString(item.tour_or_event) || readString(item.tour) || readString(item.event),
      year: readString(item.year),
      placement: readString(item.placement) || readString(item.result),
      note: readString(item.note) || readString(item.detail),
    }))
    .filter((item) => item.title.length > 0);

  const sponsorships = parseItemsArray(sectionMap.get('sponsorships'), 'items')
    .map((item) => ({
      brand: readString(item.brand_name) || readString(item.brand) || '',
      role: readString(item.role),
      period: readString(item.contract_period) || readString(item.period),
      link: readString(item.link),
      logoUrl: readString(item.logo_url) || readString(item.logo),
    }))
    .filter((item) => item.brand.length > 0);

  const mediaHighlights = parseItemsArray(sectionMap.get('media'), 'items')
    .map((item) => ({
      outlet: readString(item.outlet),
      headline: readString(item.headline) || readString(item.title) || '',
      date: readString(item.date),
      link: readString(item.link),
      mediaType: readString(item.media_type) || readString(item.type),
      thumbnailUrl: readString(item.thumbnail_url) || readString(item.thumbnail),
    }))
    .filter((item) => item.headline.length > 0);

  const availability = parseItemsArray(sectionMap.get('availability'), 'items')
    .map((item) => ({
      region: readString(item.region),
      cadence: readString(item.cadence),
      preferredDays: readString(item.preferred_days) || readString(item.preferredDays),
      timeWindow: readString(item.time_window) || readString(item.timeWindow),
      seasonality: readString(item.seasonality),
    }))
    .filter((item) => Object.values(item).some((value) => typeof value === 'string' && value.length > 0));

  const galleryImages = parseStringArray(sectionMap.get('gallery'), 'images');

  const curriculum = parseItemsArray(sectionMap.get('curriculum'), 'items')
    .map((item) => ({
      title: readString(item.title) || '',
      description: readString(item.description) || readString(item.body) || '',
      duration: readString(item.duration),
    }))
    .filter((item) => item.title.length > 0 && item.description.length > 0);

  const priceTiers = parseItemsArray(sectionMap.get('pricing'), 'plans', 'items')
    .map((item) => ({
      name: readString(item.name) || readString(item.title) || '',
      price: readString(item.price) || '',
      duration: readString(item.duration),
      features: (() => {
        const parsed = parseFeatureList(item.features);
        return parsed.length > 0 ? parsed : undefined;
      })(),
      popular: parseBoolean(item.popular),
    }))
    .filter((item) => item.name.length > 0 && item.price.length > 0);

  const faq = parseItemsArray(sectionMap.get('faq'), 'items')
    .map((item) => ({
      question: readString(item.question) || readString(item.q) || '',
      answer: readString(item.answer) || readString(item.a) || '',
    }))
    .filter((item) => item.question.length > 0 && item.answer.length > 0);

  const instagramContent = sectionMap.get('instagram_feed');
  const instagramUsername =
    readString(instagramContent?.instagram_username) || profile.instagram_username;
  const instagramPosts = parseInstagramPosts(
    instagramContent,
    galleryImages.length > 0 ? galleryImages : profile.gallery_images,
    instagramUsername
  );

  const youtubeContent = sectionMap.get('youtube_embed');
  const youtubeVideos = parseYoutubeVideos(youtubeContent);

  // For now, render with minimal extended data
  // In production, this would fetch additional data from portfolio_sections, etc.
  return (
    <>
      <PortfolioHeader themeConfig={themeConfig} proName={profile.title} />
      <PortfolioRenderer
        profile={{
          ...profile,
          gallery_images: galleryImages.length > 0 ? galleryImages : profile.gallery_images,
          highlights: [
            { label: '레슨 경력', value: '10년+' },
            { label: '수강생', value: '500+' },
            { label: '평점', value: `${profile.rating || 4.9}` },
            { label: '조회수', value: `${profile.profile_views || 0}` },
          ],
          testimonials,
          achievements,
          sponsorships,
          mediaHighlights,
          availability,
          curriculum,
          priceTiers,
          faq,
          instagramPosts,
          youtubeVideos,
          instagram_username: instagramUsername || null,
        }}
        themeConfig={themeConfig}
        sections={orderedSections && orderedSections.length > 0 ? orderedSections : undefined}
      />
    </>
  );
}
