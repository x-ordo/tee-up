'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  name: string;
  title: string;
  subtitle?: string;
  heroImage: string;
  location?: string;
  languages?: string[];
  className?: string;
  contactUrl?: string; // Early CTA - scroll to contact section or external link
  ctaText?: string; // Custom CTA text (default: "문의하기")
}

export function HeroSection({
  name,
  title,
  subtitle,
  heroImage,
  location,
  languages,
  className,
  contactUrl,
  ctaText = '문의하기',
}: HeroSectionProps) {
  return (
    <header className={cn('relative min-h-[80vh] overflow-hidden', className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-[80vh] items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-16">
          {/* Badge */}
          {subtitle && (
            <div className="mb-6">
              <span className="rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-md">
                {subtitle}
              </span>
            </div>
          )}

          {/* Name & Title */}
          <h1 className="mb-4 font-pretendard text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {name}
          </h1>
          <p className="mb-8 text-xl font-medium text-white/80 lg:text-2xl">
            {title}
          </p>

          {/* Location & Languages */}
          <div className="flex flex-wrap gap-6 text-lg text-white/70">
            {location && (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            )}
            {languages && languages.length > 0 && (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{languages.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Early CTA Button */}
          {contactUrl && (
            <div className="mt-8">
              <a
                href={contactUrl}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-tee-ink-strong shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              >
                {ctaText}
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </header>
  );
}
