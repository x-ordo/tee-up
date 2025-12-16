import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicSiteByHandle, logSiteEvent } from '@/actions/sites';
import { SiteTemplate } from './SiteTemplate';

type Params = {
  params: Promise<{ handle: string }>;
};

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const result = await getPublicSiteByHandle(handle);

  if (!result.success || !result.data) {
    return {
      title: '페이지를 찾을 수 없습니다 | TEE:UP',
    };
  }

  const { site } = result.data;
  const title = `${site.title} | TEE:UP`;
  const description = site.tagline || `${site.title}의 골프 프로필`;

  return {
    title,
    description,
    openGraph: {
      type: 'profile',
      locale: 'ko_KR',
      url: `https://teeup.kr/site/${handle}`,
      title,
      description,
      siteName: 'TEE:UP',
      images: site.hero_image_url
        ? [
            {
              url: site.hero_image_url,
              width: 1200,
              height: 630,
              alt: site.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: site.hero_image_url ? [site.hero_image_url] : [],
    },
  };
}

/**
 * Public site page - 연락처 마스킹, 테마 적용
 * URL: /site/{handle}
 */
export default async function SitePage({ params }: Params) {
  const { handle } = await params;
  const result = await getPublicSiteByHandle(handle);

  if (!result.success || !result.data) {
    notFound();
  }

  const { site, theme } = result.data;

  // page_view 이벤트 로깅 (서버 사이드)
  await logSiteEvent(site.id, 'page_view');

  return <SiteTemplate site={site} theme={theme} />;
}
