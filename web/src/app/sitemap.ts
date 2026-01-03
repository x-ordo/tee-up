import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://teeup.golf';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/pro`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Supabase에서 승인된 프로 목록 가져오기
  const supabase = createPublicClient();
  const { data: proProfiles } = await supabase
    .from('pro_profiles')
    .select('slug, updated_at')
    .eq('is_approved', true)
    .not('slug', 'is', null);

  const proPages: MetadataRoute.Sitemap = (proProfiles || []).map((pro) => ({
    url: `${BASE_URL}/${pro.slug}`,
    lastModified: pro.updated_at ? new Date(pro.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 스튜디오 페이지들 가져오기
  const { data: studios } = await supabase
    .from('studios')
    .select('slug, updated_at')
    .eq('is_active', true)
    .not('slug', 'is', null);

  const studioPages: MetadataRoute.Sitemap = (studios || []).map((studio) => ({
    url: `${BASE_URL}/studio/${studio.slug}`,
    lastModified: studio.updated_at ? new Date(studio.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...proPages, ...studioPages];
}
