import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPublicProfile, incrementProfileViews } from '@/actions/profiles';
import { PortfolioRenderer } from '@/components/portfolio';

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

  // For now, render with minimal extended data
  // In production, this would fetch additional data from portfolio_sections, etc.
  return (
    <PortfolioRenderer
      profile={{
        ...profile,
        highlights: [
          { label: '레슨 경력', value: '10년+' },
          { label: '수강생', value: '500+' },
          { label: '평점', value: `${profile.rating || 4.9}` },
          { label: '조회수', value: `${profile.profile_views || 0}` },
        ],
        testimonials: [],
      }}
    />
  );
}
