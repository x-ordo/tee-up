'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export type MediaHighlight = {
  outlet?: string;
  headline: string;
  date?: string;
  link?: string;
  mediaType?: string;
  thumbnailUrl?: string;
};

interface MediaHighlightsSectionProps {
  highlights: MediaHighlight[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function MediaHighlightsSection({
  highlights,
  title = '미디어 & 프레스',
  subtitle,
  className,
}: MediaHighlightsSectionProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className={cn('bg-tee-background px-6 py-16', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tee-ink-muted">
            Media
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm font-medium tracking-[0.08em] text-tee-ink-light">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item, index) => (
            <Card
              key={`${item.headline}-${index}`}
              className="overflow-hidden border-tee-stone/60 bg-white/90 p-0 shadow-none"
            >
              <div className="flex h-full flex-col md:flex-row">
                {item.thumbnailUrl ? (
                  <div className="relative h-40 w-full shrink-0 overflow-hidden md:h-auto md:w-48">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.headline}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-tee-stone/40 text-xs font-semibold text-tee-ink-muted md:h-auto md:w-48">
                    MEDIA
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-tee-ink-muted">
                      {item.mediaType && <span>{item.mediaType}</span>}
                      {item.outlet && <span>{item.outlet}</span>}
                      {item.date && <span>{item.date}</span>}
                    </div>
                    <h3 className="text-lg font-semibold text-tee-ink-strong">
                      {item.headline}
                    </h3>
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-xs font-semibold text-tee-accent-primary hover:underline"
                    >
                      기사 보기
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
