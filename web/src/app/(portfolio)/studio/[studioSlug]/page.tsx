import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicStudio, getStudioPros } from '@/actions/studios';
import { Card, CardContent } from '@/components/ui/Card';

interface StudioPageProps {
  params: Promise<{ studioSlug: string }>;
}

export async function generateMetadata({ params }: StudioPageProps): Promise<Metadata> {
  const { studioSlug } = await params;
  const result = await getPublicStudio(studioSlug);

  if (!result.success || !result.data) {
    return {
      title: 'Studio Not Found',
    };
  }

  const studio = result.data;

  return {
    title: `${studio.name} | Golf Studio`,
    description: studio.description || `${studio.name} - Professional Golf Academy`,
    openGraph: {
      title: studio.name,
      description: studio.description || undefined,
      images: studio.cover_image_url ? [studio.cover_image_url] : undefined,
    },
  };
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { studioSlug } = await params;
  const studioResult = await getPublicStudio(studioSlug);

  if (!studioResult.success || !studioResult.data) {
    notFound();
  }

  const studio = studioResult.data;
  const prosResult = await getStudioPros(studio.id);
  const pros = prosResult.success ? prosResult.data : [];

  return (
    <div className="min-h-screen bg-tee-surface">
      {/* Hero */}
      <header className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {studio.cover_image_url ? (
          <>
            <Image
              src={studio.cover_image_url}
              alt={studio.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-tee-accent-primary to-tee-accent-primary/80" />
        )}

        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12">
            {studio.logo_url && (
              <div className="mb-6 h-20 w-20 overflow-hidden rounded-xl bg-white p-2">
                <Image
                  src={studio.logo_url}
                  alt={`${studio.name} logo`}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            )}
            <h1 className="mb-4 font-pretendard text-5xl font-bold text-white lg:text-6xl">
              {studio.name}
            </h1>
            {studio.location && (
              <p className="flex items-center gap-2 text-lg text-white/80">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {studio.location}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Description */}
      {studio.description && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg leading-relaxed text-tee-ink-light">
              {studio.description}
            </p>
          </div>
        </section>
      )}

      {/* Pros */}
      <section className="bg-tee-background px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-pretendard text-3xl font-bold text-tee-ink-strong">
            소속 프로
          </h2>

          {pros.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pros.map((pro) => (
                <Link key={pro.id} href={`/${pro.slug}`}>
                  <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="aspect-[4/3] overflow-hidden">
                      {pro.profile_image_url ? (
                        <Image
                          src={pro.profile_image_url}
                          alt={pro.title}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-tee-accent-primary/10 text-4xl text-tee-accent-primary">
                          {pro.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-tee-ink-strong">
                        {pro.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-tee-ink-light">
              소속 프로가 없습니다.
            </p>
          )}
        </div>
      </section>

      {/* Contact Links */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-4">
            {studio.website_url && (
              <a
                href={studio.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-tee-ink-light/20 px-6 py-3 text-sm font-medium text-tee-ink-strong transition-colors hover:border-tee-accent-primary hover:text-tee-accent-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                웹사이트
              </a>
            )}
            {studio.instagram_url && (
              <a
                href={studio.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-tee-ink-light/20 px-6 py-3 text-sm font-medium text-tee-ink-strong transition-colors hover:border-tee-accent-primary hover:text-tee-accent-primary"
              >
                Instagram
              </a>
            )}
            {studio.youtube_url && (
              <a
                href={studio.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-tee-ink-light/20 px-6 py-3 text-sm font-medium text-tee-ink-strong transition-colors hover:border-tee-accent-primary hover:text-tee-accent-primary"
              >
                YouTube
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 text-center text-xs text-tee-ink-light/50">
        <p>© {new Date().getFullYear()} {studio.name}. All rights reserved</p>
      </footer>
    </div>
  );
}
